import pandas as pd
from scipy.sparse import csr_matrix
import numpy as np
from sklearn.neighbors import NearestNeighbors
import requests
from bs4 import BeautifulSoup
import json


def create_ratings_df(n_vote_user, n_vote_recipe):
    """
    The create_ratings_df function creates a dataframe of the ratings from the RAW_interactions.csv file, 
    where each row is a user-recipe pair and contains their rating for that recipe. The function also filters out 
    any users who have rated less than n_vote_user recipes and any recipes that have been rated
    
    :param n_vote_user: Filter the users that have voted at least n times
    :param n_vote_recipe: Filter the recipes that have been rated at least n times
    :return: A dataframe with the ratings of each user
    """
    df = pd.read_csv("../src/recipesDB/RAW_interactions.csv")

    grade = df[["user_id", "recipe_id", "rating"]]

    data_df = pd.DataFrame(grade['user_id'].value_counts())
    final_data = data_df[(data_df["user_id"] > n_vote_user)]

    data_df1 = pd.DataFrame(grade['recipe_id'].value_counts())
    final_data1 = data_df1[(data_df1["recipe_id"] > n_vote_recipe)]

    ratings = df.loc[(df['user_id'].isin(final_data.index)) & (df['recipe_id'].isin(final_data1.index))]
    ratings = ratings.drop(columns=['date', 'review'], axis=1)
    return ratings


def create_matrix(df):
    """
    The create_matrix function creates a sparse matrix of the ratings dataframe.
    It maps user_id and recipe_id to indices, which are used as coordinates in the
    sparse matrix. The function also creates dictionaries that map IDs to indices
    and vice versa.
    
    
    :param df: Create the matrix
    :return: A sparse matrix of the ratings dataframe
    """

    N = len(df['user_id'].unique())
    M = len(df['recipe_id'].unique())

    # Map Ids to indices
    user_mapper = dict(zip(np.unique(df["user_id"]), list(range(N))))
    recipe_mapper = dict(zip(np.unique(df["recipe_id"]), list(range(M))))

    # Map indices to IDs
    user_inv_mapper = dict(zip(list(range(N)), np.unique(df["user_id"])))
    recipe_inv_mapper = dict(zip(list(range(M)), np.unique(df["recipe_id"])))

    user_index = [user_mapper[i] for i in df['user_id']]
    recipe_index = [recipe_mapper[i] for i in df['recipe_id']]

    X = csr_matrix((df["rating"], (recipe_index, user_index)), shape=(M, N))

    return X, user_mapper, recipe_mapper, user_inv_mapper, recipe_inv_mapper


def find_similar_recipes(recipe_id, ratings, k, metric='cosine', show_distance=False):
    """
    The find_similar_recipes function takes a recipe id, the ratings matrix, and the number of similar recipes to return.
    It returns a list of ids for similar recipes.

    :param recipe_id: Find the index of the recipe in our matrix
    :param ratings: Create the matrix
    :param k: Determine how many similar recipes to return
    :param metric='cosine': Define the distance metric used
    :param show_distance=False: Indicate whether the distance between the input recipe and its k nearest neighbours should be returned or not
    :return: A list of k similar recipes
    """
    X, user_mapper, recipe_mapper, user_inv_mapper, recipe_inv_mapper = create_matrix(ratings)
    neighbour_ids = []

    recipe_ind = recipe_mapper[recipe_id]
    recipe_vec = X[recipe_ind]
    k += 1
    kNN = NearestNeighbors(n_neighbors=k, algorithm="brute", metric=metric)
    kNN.fit(X)
    recipe_vec = recipe_vec.reshape(1, -1)
    neighbour = kNN.kneighbors(recipe_vec, return_distance=show_distance)
    for i in range(0, k):
        n = neighbour.item(i)
        neighbour_ids.append(recipe_inv_mapper[n])
    neighbour_ids.pop(0)
    return neighbour_ids


def find_similar_users(user_id, ratings, k, metric='cosine', show_distance=False):
    """
    The find_similar_users function takes a user id, the ratings matrix, and the number of similar users to return.
    It returns a list of ids for similar users.

    :param user_id: Find the index of the user in our matrix
    :param ratings: Create the matrix
    :param k: Determine how many similar users to return
    :param metric='cosine': Define the distance metric used
    :param show_distance=False: Indicate whether the distance between the input user and its k nearest neighbours should be returned or not
    :return: A list of k similar users
    """
    X, user_mapper, recipe_mapper, user_inv_mapper, recipe_inv_mapper = create_matrix(ratings)
    neighbour_ids = []

    user_ind = user_mapper[user_id]
    user_vec = X[user_ind]
    k += 1
    kNN = NearestNeighbors(n_neighbors=k, algorithm="brute", metric=metric)
    kNN.fit(X)
    user_vec = user_vec.reshape(1, -1)
    neighbour = kNN.kneighbors(user_vec, return_distance=show_distance)
    for i in range(0, k):
        n = neighbour.item(i)
        neighbour_ids.append(user_inv_mapper[n])
    neighbour_ids.pop(0)
    return neighbour_ids


class Ingredient:
    def __init__(self, name, quantity):
        self.name = name
        if quantity == '':
            self.quantity = '∅'
        else:
            self.quantity = quantity

    def __eq__(self, o: object):
        return self.name == o.name

    def __str__(self):
        return f"{self.quantity} {self.name}"

    def __dict__(self):
        return {"quantity": str(self.quantity), "name": self.name}


class SmallRecipe:
    DF = pd.read_csv("../src/recipesDB/RAW_recipes.csv")

    def __init__(self, recipe_id):
        self.recipe_id = recipe_id
        self.name = self.DF[self.DF['id'] == self.recipe_id]['name'].values[0]

    def __dict__(self):
        return {"recipe_id": self.recipe_id, "name": self.name}


class MediumRecipe(SmallRecipe):

    def __init__(self, recipe_id, soup):
        super().__init__(recipe_id)
        self.image = self.get_image(soup)
        self.tags = self.get_tags()
        self.time = self.get_time(soup)
        self.nutrition = self.get_nutrition()

    def __dict__(self):
        return {"recipe_id": self.recipe_id, "name": self.name, "time": self.time, "image": self.image,
                "nutrition": self.nutrition, "tags": self.tags}

    def get_time(self, soup):
        """
        The get_time function scrapes the time it takes to make a recipe from food.com

        :param self: Access variables that belongs to the class
        :param soup: The BeautifulSoup parameter used to parse the html
        :return: The total time it takes to make a recipe
        """
        return soup.select_one('dd.facts__value.facts__value--light.svelte-1avdnba').text

    def get_image(self, soup):
        imgs = [i.get('srcset') for i in soup.find_all('img', srcset=True)]
        return imgs[0].split(' ')[0]

    def get_nutrition(self):
        df = Recipe.DF.copy()
        df[['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
            'carbohydrates (PDV)']] = df.nutrition.str.split(",", expand=True)
        df['calories'] = df['calories'].apply(lambda x: x.replace('[', ''))
        df['carbohydrates (PDV)'] = df['carbohydrates (PDV)'].apply(lambda x: x.replace(']', ''))
        df[['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
            'carbohydrates (PDV)']] = df[
            ['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
             'carbohydrates (PDV)']].astype('float')
        df = df[df['id'] == self.recipe_id][
            ['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
             'carbohydrates (PDV)']]
        for index, row in df.iterrows():
            dict = {"calories": row["calories"], "total fat": row["total fat (PDV)"], "sugar": row["sugar (PDV)"],
                    "sodium": row["sodium (PDV)"], "protein": row["protein (PDV)"],
                    "saturated fat": row["saturated fat (PDV)"], "carbohydrates": row["carbohydrates (PDV)"]}
        return dict

    def get_tags(self):
        df = Recipe.DF.copy()
        df = df[df['id'] == self.recipe_id]['tags']
        tagsString = str(df.values)
        tagsString = tagsString.translate({ord(i): None for i in '["\' ]'})
        tagsTab = tagsString.split(',')
        return tagsTab


class Recipe(MediumRecipe):
    def __init__(self, recipe_id, soup):
        super().__init__(recipe_id, soup)
        self.ingredients = self.get_ingredients(soup)
        self.servings = self.get_servings(soup)
        self.steps = self.get_steps(soup)

    def __dict__(self):
        return {"recipe_id": self.recipe_id, "name": self.name, "time": self.time, "image": self.image, "nutrition": self.nutrition, "tags": self.tags,
                "servings": self.servings, "ingredients": [ing.__dict__() for ing in self.ingredients],  "steps": self.steps}

    def get_ingredients(self, soup):
        """
        The get_ingredients function takes in a recipe_id and returns the list of ingredients for the given recipe by scrapping the informations on Food.com.
        If there is no serving size listed, it will return None.

        :param self: Access variables that belongs to the class
        :param soup: The BeautifulSoup parameter used to parse the html
        :return: The number of servings for the recipe
        """
        mydivs = soup.select_one('.ingredients.svelte-1avdnba')

        ingTab = []

        for ingredient in mydivs.find_all('li'):
            if ingredient.find('span', class_='ingredient__text'):
                ing = Ingredient(ingredient.find('span', class_='ingredient__text').text,
                                 ingredient.find('span', class_='ingredient__quantity').text)
                ingTab.append(ing)
        return ingTab

    def get_steps(self, soup):
        mydivs = soup.select_one('.directions.svelte-1avdnba')

        stepsTab = []

        for li in mydivs.find_all('li'):
            stepsTab.append(li.text)
        return stepsTab

    def get_servings(self, soup):
        """
        The get_servings function takes in a recipe_id and returns the number of servings that the recipe makes.
        If there is no serving size listed, it will return None.

        :param self: Access variables that belongs to the class
        :param soup: The BeautifulSoup parameter used to parse the html
        :return: The number of servings for the recipe
        """

        output = soup.select_one('button.facts__value.facts__control.theme-color.svelte-1avdnba').text
        if not output.isnumeric():
            if "-" in output:
                num = []
                for letter in output:
                    if letter.isdigit():
                        num.append(int(letter))

                return float((num[0] + num[1]) / 2)
            if "/" in output:
                num, den = output.split('/')
                return "{:.2f}".format(float(num) / float(den))
            return int([int(s) for s in output.split() if s.isdigit()][0])
        else:
            return int(output)


def get_liked_recipes(user_id, df):
    liked_recipes = df[(df['user_id'] == user_id) & (df['rating'] >= 3.5)]['recipe_id']
    i = 5 if len(liked_recipes) > 5 else len(liked_recipes)
    id_tab = pd.Series(liked_recipes.sample(n=i, random_state=1)).array
    return id_tab


def main_function(user_id):
    ratings = create_ratings_df(50, 50)
    similar_ids = []
    for id in get_liked_recipes(user_id, ratings):
        similar_ids.extend(find_similar_recipes(id, ratings, k=10))
    recipe_tab = []
    for recipe_ids in similar_ids:
        response = requests.get('http://www.food.com/recipe/' + str(recipe_ids))
        if response.status_code == 200:
            print('Web site exists')
            recipe = Recipe(recipe_ids)
            recipe_tab.append(recipe.__dict__())
    return recipe_tab


def get_all_recipes_index_json():
    # ouverture du tableau de note des utilisateurs
    # besoin du fichier "RAW_interactions.csv"

    df = pd.read_csv("../src/recipesDB/RAW_interactions.csv")
    grade = df[["user_id", "recipe_id", "rating"]]

    # modifier le nombre de vote ici

    ###########################################
    n_vote_user = 50
    n_vote_recipes = 50
    ###########################################

    # creation d'un dataframe permettant de choisir les utilisateurs avec plus de 50 votes

    data_df = pd.DataFrame(grade['user_id'].value_counts())
    final_data = data_df[(data_df["user_id"] > n_vote_user)]
    index_list = final_data.index

    # creation d'un dataframe permettant de choisir les recettes avec plus de 50 votes

    data_df1 = pd.DataFrame(grade['recipe_id'].value_counts())
    final_data1 = data_df1[(data_df1["recipe_id"] > n_vote_recipes)]
    index_list1 = final_data1.index

    in_index = grade[(grade["user_id"].isin(index_list) & grade["recipe_id"].isin(index_list1))]
    return list_unique_in_index(in_index)

def list_unique_in_index(in_index):
    """
    retourne en list les valeurs unique de la colonne recipe_id
    """
    return list(in_index['recipe_id'].unique())

def get_json_recipes():
    all_recipes_ids = get_all_recipes_index_json()
    recipe_tab = []
    for recipe_ids in all_recipes_ids:
        response = requests.get('http://www.food.com/recipe/' + str(recipe_ids))
        if response.status_code == 200:
            print('Web site exists')
            recipe = Recipe(recipe_ids)
            recipe_tab.append(recipe.__dict__())
    return recipe_tab

tab = get_json_recipes()
with open('all_recipes.json', 'w') as f:
    json.dump(tab, f, indent=4)
    print('new json ok')


"""
id = 137739
recipe1 = SmallRecipe(id)
page = requests.get('http://www.food.com/recipe/' + str(id))
if page.status_code == 200:
    print('Web site exists')
    soup = BeautifulSoup(page.content, "html.parser")
    recipe2 = MediumRecipe(id, soup)
    recipe3 = Recipe(id, soup)

print(recipe1.__dict__())
print(recipe2.__dict__())
print(recipe3.__dict__())
print(recipe3.servings)

user_id = 1533
#tab = main_function(user_id)
tab = get_all_names()
with open('all_recipes.json', 'w') as f:
    json.dump(tab, f, indent=4)
    print('new json ok')"""
# ouverture du tableau de note des utilisateurs
# besoin du fichier "RAW_interactions.csv"

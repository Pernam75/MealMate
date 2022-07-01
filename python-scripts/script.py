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


class Recipe:
    def __init__(self, name, recipe_id, ingredients, servings, time, image, steps, nutrition, tags):
        self.name = name
        self.recipe_id = recipe_id
        self.ingredients = ingredients
        self.servings = servings
        self.time = time
        self.image = image
        self.steps = steps
        self.nutrition = nutrition
        self.tags = tags

    def __init__(self, recipe_id):
        self.recipe_id = recipe_id

        # Web scrapping

        URL = "https://www.food.com/recipe/" + str(self.recipe_id)
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")

        self.name = self.get_name(soup)
        self.ingredients = self.get_ingredients(soup)
        self.servings = self.get_servings(soup)
        self.time = self.get_time(soup)
        self.image = self.get_image(soup)
        self.steps = self.get_steps(soup)
        self.nutrition = self.get_nutrition()
        self.tags = self.get_tags()

    def __dict__(self):
        return {"recipe_id": str(self.recipe_id), "name": self.name, "servings": str(self.servings), "time": self.time,
                "ingredients": [ing.__dict__() for ing in self.ingredients], "image": self.image, "steps": self.steps,
                "nutrition": self.nutrition, "tags": self.tags}

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

        if "-" in output:
            num = []
            for letter in output:
                if letter.isdigit():
                    num.append(int(letter))
            return int((num[0] + num[1]) / 2)
        if not output.isnumeric():
            return int([int(s) for s in output.split() if s.isdigit()][0])
        else:
            return int(output)

    def get_time(self, soup):
        """
        The get_time function scrapes the time it takes to make a recipe from food.com
        
        :param self: Access variables that belongs to the class
        :param soup: The BeautifulSoup parameter used to parse the html
        :return: The total time it takes to make a recipe
        """
        return soup.select_one('dd.facts__value.facts__value--light.svelte-1avdnba').text

    def get_name(self, soup):
        """
        The get_name function returns the name of a recipe given its Food.com ID number.
        
        :param self: Tell the function to refer to the object that called it
        :param soup: The BeautifulSoup parameter used to parse the html
        :return: The name of the recipe
        """
        return soup.select_one('h1.title').text

    def get_image(self, soup):
        imgs = [i.get('srcset') for i in soup.find_all('img', srcset=True)]
        return imgs[0].split(' ')[0]

    def get_nutrition(self):
        df1 = pd.read_csv("../src/recipesDB/RAW_recipes.csv")
        df1[['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
             'carbohydrates (PDV)']] = df1.nutrition.str.split(",", expand=True)
        df1['calories'] = df1['calories'].apply(lambda x: x.replace('[', ''))
        df1['carbohydrates (PDV)'] = df1['carbohydrates (PDV)'].apply(lambda x: x.replace(']', ''))
        df1[['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
             'carbohydrates (PDV)']] = df1[
            ['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
             'carbohydrates (PDV)']].astype('float')
        df1 = df1[df1['id'] == self.recipe_id][['calories', 'total fat (PDV)', 'sugar (PDV)', 'sodium (PDV)', 'protein (PDV)', 'saturated fat (PDV)',
             'carbohydrates (PDV)']]
        nutritionTab = []
        for index, row in df1.iterrows():
            dict = {"calories": row["calories"], "total fat": row["total fat (PDV)"], "sugar": row["sugar (PDV)"], "sodium": row["sodium (PDV)"], "protein": row["protein (PDV)"],
                    "saturated fat": row["saturated fat (PDV)"], "carbohydrates": row["carbohydrates (PDV)"]}
        return dict

    def get_tags(self):
        df1 = pd.read_csv("../src/recipesDB/RAW_recipes.csv")
        df1 = df1[df1['id'] == self.recipe_id]['tags']
        tagsString = str(df1.values)
        tagsString = tagsString.translate({ord(i): None for i in '["\' ]'})
        tagsTab = tagsString.split(',')
        return tagsTab




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
        recipe = Recipe(recipe_ids)
        recipe_tab.append(recipe.__dict__())
    return recipe_tab



user_id = 1533
tab = main_function(user_id)
with open('new_file.json', 'w') as f:
    json.dump(tab, f, indent=4)
    print('new json ok')


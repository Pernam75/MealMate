import pandas as pd
from scipy.sparse import csr_matrix
import numpy as np
from sklearn.neighbors import NearestNeighbors
import requests
from bs4 import BeautifulSoup


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
    :return: The sparse matrix x
    :doc-author: Trelent
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

    def __eq__(self, o: object) -> bool:
        return self.name == o.name

    def __str__(self) -> str:
        return f"{self.quantity} {self.name}"


class Recipe:
    def __init__(self, name, recipe_id, ingredients, servings, time):
        self.name = name
        self.recipe_id = recipe_id
        self.ingredients = ingredients
        self.servings = servings
        self.time = time

    def __init__(self, recipe_id):
        self.recipe_id = recipe_id
        self.name = self.get_name()
        self.ingredients = self.get_ingredients()
        self.servings = self.get_servings()
        self.time = self.get_time()

    def __str__(self):
        string = f"{str(self.recipe_id)} : {self.name}\nServings : {self.servings}\nTime :{self.time}\n"
        for i in self.ingredients:
            string += i.__str__()
        return string

    def get_ingredients(self):
        """
        The get_ingredients function takes a recipe id as an argument and uses web scrapping to return
        the ingredients and quantities for that recipe.


        :param recipe_id: Get the recipe id from the url
        :return: A dictionary of ingredients and their quantities
        """
        URL = "https://www.food.com/recipe/" + str(self.recipe_id)
        page = requests.get(URL)

        soup = BeautifulSoup(page.content, "html.parser")
        mydivs = soup.select_one('.ingredients.svelte-1avdnba')

        ingTab = []

        for ingredient in mydivs.find_all('li'):
            if ingredient.find('span', class_='ingredient__text'):
                ing = Ingredient(ingredient.find('span', class_='ingredient__text').text,
                                 ingredient.find('span', class_='ingredient__quantity').text)
                ingTab.append(ing)
        return ingTab

    def get_servings(self):
        URL = "https://www.food.com/recipe/" + str(self.recipe_id)
        page = requests.get(URL)

        soup = BeautifulSoup(page.content, "html.parser")
        output = soup.select_one('button.facts__value.facts__control.theme-color.svelte-1avdnba').text

        if "-" in output:
            num = []
            for letter in output:
                if letter.isdigit():
                    num.append(int(letter))
            print(num)
            return num
        else:
            return int(output)

    def get_time(self):
        URL = "https://www.food.com/recipe/" + str(self.recipe_id)
        page = requests.get(URL)

        soup = BeautifulSoup(page.content, "html.parser")
        return soup.select_one('dd.facts__value.facts__value--light.svelte-1avdnba').text

    def get_name(self):
        URL = "https://www.food.com/recipe/" + str(self.recipe_id)
        page = requests.get(URL)

        soup = BeautifulSoup(page.content, "html.parser")
        return soup.select_one('h1.title').text


ratings = create_ratings_df(50, 50)
# X, user_mapper, recipe_mapper, user_inv_mapper, recipe_inv_mapper = create_matrix(ratings)
# Exemples d'id recette à tester :
# [486496, 495275, 474987, 495271, 16512, 16859, 105594, 121799, 14111, 33387]
recipe_id = 486496
similar_ids = find_similar_recipes(recipe_id, ratings, k=10)
recipe = Recipe(recipe_id)
print(f"Similar recipes to {recipe.name} are: ")
for id in similar_ids:
    print(id)
    print(Recipe(id).name)
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

    grade = df[["user_id","recipe_id","rating"]]

    data_df = pd.DataFrame(grade['user_id'].value_counts())
    final_data = data_df[(data_df["user_id"]>n_vote_user)]

    data_df1 = pd.DataFrame(grade['recipe_id'].value_counts())
    final_data1 = data_df1[(data_df1["recipe_id"]>n_vote_recipe)]

    ratings = df.loc[(df['user_id'].isin(final_data.index)) & (df['recipe_id'].isin(final_data1.index))]
    ratings.drop(columns = ['date', 'review'], axis=1, inplace=True)
    return ratings

def create_matrix(df):
    """
    The create_matrix function creates a sparse matrix from the ratings dataframe. 
    The function also creates dictionaries that map user_id and recipe_id to indices, 
    and vice versa.
    
    :param df: Create the matrix
    :return: A sparse matrix with the recipe_id and user_id as row and column indices, respectively
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

def find_similar_recipes(recipe_id, k, metric='cosine', show_distance=False):
    """
    The find_similar_recipes function takes a recipe id, the matrix of recipes and their features, 
    the number of similar recipes to return (k), and an optional argument for whether or not you want to see 
    the distance between the input recipe and returned similar recipes. It returns a list of k recipe IDs that are most similar 
    
    
    :param recipe_id: Identify the recipe for which similar recipes are to be found
    :param X: Pass the data to the nearestneighbors function
    :param k: Define the number of similar recipes to be returned
    :param metric='cosine': Specify the distance metric to be used
    :param show_distance=False: Specify whether the distance of each neighbour should be returned as well
    :return: A list of the ids of similar recipes to a given recipe
    """
      
    neighbour_ids = []

    ratings = create_ratings_df(50, 50)
    X, user_mapper, recipe_mapper, user_inv_mapper, recipe_inv_mapper = create_matrix(ratings)

    recipe_ind = recipe_mapper[recipe_id]
    recipe_vec = X[recipe_ind]
    k+=1
    kNN = NearestNeighbors(n_neighbors=k, algorithm="brute", metric=metric)
    kNN.fit(X)
    recipe_vec = recipe_vec.reshape(1,-1)
    neighbour = kNN.kneighbors(recipe_vec, return_distance=show_distance)
    for i in range(0,k):
        n = neighbour.item(i)
        neighbour_ids.append(recipe_inv_mapper[n])
    neighbour_ids.pop(0)
    return neighbour_ids

def find_similar_users(user_id, k, metric='cosine', show_distance=False):
    """
    The find_similar_users function takes a user id, the matrix of users and their features, 
    the number of similar users to return (k), and an optional argument for whether or not you want to see 
    the distance between the input user and returned similar users. It returns a list of k user IDs that are most similar 
    
    :param user_id: Identify the user for which similar users are to be found
    :param X: Pass the data to the nearestneighbors function
    :param k: Define the number of similar users to be returned
    :param metric='cosine': Specify the distance metric to be used
    :param show_distance=False: Specify whether the distance of each neighbour should be returned as well
    :return: A list of the ids of similar users to a given user
    """
      
    neighbour_ids = []

    ratings = create_ratings_df(50, 50)
    X, user_mapper, recipe_mapper, user_inv_mapper, recipe_inv_mapper = create_matrix(ratings)

    user_ind = user_mapper[user_id]
    user_vec = X[user_ind]
    k+=1
    kNN = NearestNeighbors(n_neighbors=k, algorithm="brute", metric=metric)
    kNN.fit(X)
    user_vec = user_vec.reshape(1,-1)
    neighbour = kNN.kneighbors(user_vec, return_distance=show_distance)
    for i in range(0,k):
        n = neighbour.item(i)
        neighbour_ids.append(user_inv_mapper[n])
    neighbour_ids.pop(0)
    return neighbour_ids

def user_based_classification_filtering(user_id, ratings):
    """
    The user_based_classification_filtering function takes a user_id and ratings dataframe as input. 
    It then finds the 10 most similar users to the given user_id, based on cosine similarity of their ratings vectors. 
    The function then returns a list of recipe_ids that these 10 users have rated highly.
    
    :param user_id: Specify the user for which we want to find similar users
    :param ratings: Store the ratings of all users
    :return: The list of recipes that are the most popular among the neighbours
    """
    neighbours_ids = find_similar_users(user_id, 10, 'cosine', True)
    recipes_ids = []
    ratings2 = ratings.copy()
    for id in neighbours_ids:
        added = False
        while not added:
            if ratings2[ratings2['user_id']=='id'].loc[ratings2['recipe_id'].idxmax()] not in recipes_ids:
                recipes_ids.append(ratings2[ratings2['user_id']=='id'].loc[ratings2['recipe_id'].idxmax()])
                added = True
            else:
                ratings2 = ratings2.drop(ratings2[ratings2['user_id']=='id'].loc[ratings2['recipe_id'].idxmax()])
    return recipes_ids

def item_based_classification_filtering(recipe_id):
    return find_similar_recipes(recipe_id, 10, 'cosine', True)


def get_ingredients(recipe_id):
    """
    The get_ingredients function takes a recipe id as an argument and uses web scrapping to return
    the ingredients and quantities for that recipe.
    
    
    :param recipe_id: Get the recipe id from the url
    :return: A dictionary of ingredients and their quantities
    """
    URL = "https://www.food.com/recipe/"+recipe_id
    page = requests.get(URL)

    soup = BeautifulSoup(page.content, "html.parser")
    mydivs = soup.select_one('.ingredients.svelte-1avdnba')


    ingredients_dic = {}
    for ingredient in mydivs.find_all('li'):
        ingredient_name = ingredient.find('span', class_='ingredient__text').text
        ingredient_amount = ingredient.find('span', class_='ingredient__quantity').text
        ingredients_dic[ingredient_name] = ingredient_amount
    return ingredients_dic

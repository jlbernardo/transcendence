from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the auth index.")

def login():
    """ create login endpoint"""
    pass

def register():
    """ create register endpoint"""
    pass
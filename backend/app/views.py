from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from geolib import geohash
import os
import requests

load_dotenv()

ticketMasterKey = os.getenv('ticketMasterKey')

class Suggest(APIView):
    def get(self, request):
        if keyword := request.GET.get('keyword'):
            params = {'keyword': keyword, 'apikey': ticketMasterKey}
            response = requests.get(
                'https://app.ticketmaster.com/discovery/v2/suggest', params=params)
            return Response(response.json())
        return Response(status=status.HTTP_400_BAD_REQUEST)


class Search(APIView):
    def get(self, request):

        keyword = request.GET.get('keyword', None)
        lat = request.GET.get('latitude', None)
        lng = request.GET.get('longitude', None)
        segmentId = request.GET.get('segmentId', None)
        radius = request.GET.get('radius', None)

        try:
            geo = geohash.encode(lat, lng, 7)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if keyword and lat and lng and segmentId and radius:
            params = {
                'keyword': keyword,
                'geoPoint': geo,
                'apikey': ticketMasterKey,
                'segmentId': segmentId,
                'radius': radius,
                'unit': 'miles'
            }
            response = requests.get(
                'https://app.ticketmaster.com/discovery/v2/events', params=params)
            return Response(response.json())
        return Response(status=status.HTTP_400_BAD_REQUEST)


class EventDetails(APIView):
    def get(self, request):
        if id := request.GET.get("id"):
            params = {
                'apikey': ticketMasterKey
            }
            response = requests.get(
                f'https://app.ticketmaster.com/discovery/v2/events/{id}', params=params)
            return Response(response.json())
        return Response(status=status.HTTP_400_BAD_REQUEST)

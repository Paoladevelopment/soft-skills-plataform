import os
from typing import Any, Dict, List, Optional

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database


class MongoDB:
    def __init__(self):
        try:
            # Try to import load_dotenv, but make it optional
            try:
                from dotenv import load_dotenv
            except ModuleNotFoundError:
                load_dotenv = None

            # Load environment variables from a .env file, if available and in local environment
            # In production (Vercel), rely only on environment variables provided by the platform
            if load_dotenv is not None and os.getenv("ENV", "local") == "local":
                load_dotenv()

            mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
            db_name = os.getenv("MONGODB_DB_NAME", "soft_skills")
            
            self._client = MongoClient(mongo_uri)
            self._db = self._client[db_name]
        except Exception as err:
            raise err

    @property
    def client(self) -> MongoClient:
        return self._client

    @property
    def db(self) -> Database:
        return self._db
    
    def set_db(self, db_name: str):
        self._db = self._client[db_name]

    def get_collection(self, collection_name: str) -> Collection:
        return self._db[collection_name]

    def insert_one(self, collection_name: str, document: Dict[str, Any]):
        try:
            collection = self.get_collection(collection_name)
            result = collection.insert_one(document)

            return result
        
        except Exception as err:
            raise err

    def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            collection = self.get_collection(collection_name)
            return collection.find_one(query)
        
        except Exception as err:
            raise err

    def find_many(
            self, 
            collection_name: str, 
            query: Dict[str, Any], 
            sort: Optional[List[tuple]] = None, 
            limit: Optional[int] = None, 
            skip: Optional[int] = None) -> List[Dict[str, Any]]:
        try:
            collection = self.get_collection(collection_name)
            cursor = collection.find(query)
            
            if sort:
                cursor = cursor.sort(sort)
            
            if skip:
                cursor = cursor.skip(skip)
            
            if limit:
                cursor = cursor.limit(limit)
            
            return list(cursor)
        
        except Exception as err:
            raise err

    def update_one(
        self, 
        collection_name: str, 
        query: Dict[str, Any], 
        update: Dict[str, Any], 
        upsert: bool = False,
        array_filters: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        try:
            collection = self.get_collection(collection_name)
            result = collection.update_one(
                query, 
                update, 
                upsert=upsert,
                array_filters=array_filters
            )
            
            return result.modified_count > 0 or result.upserted_id is not None
        
        except Exception as err:
            raise err

    def delete_one(self, collection_name: str, query: Dict[str, Any]) -> bool:
        try:
            collection = self.get_collection(collection_name)
            result = collection.delete_one(query)

            return result.deleted_count > 0
        except Exception as err:
            raise err

    def count_documents(self, collection_name: str, query: Dict[str, Any]) -> int:
        try:
            collection = self.get_collection(collection_name)
            return collection.count_documents(query)
        except Exception as err:
            raise err
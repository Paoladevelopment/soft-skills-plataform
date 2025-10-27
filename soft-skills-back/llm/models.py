"""
LLM client module for executing prompts with LangChain and OpenAI.

Handles LLM model configuration, execution, and JSON response parsing.
"""

import json
import os
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from utils.errors import APIException, BadRequest


class LLMClient:
    """Client for executing LLM prompts and parsing JSON responses."""
    
    def __init__(
        self, 
        model_name: str = "gpt-4o-mini",
        temperature: float = 0.7,
        api_key: Optional[str] = None
    ):
        """
        Initialize the LLM client.
        
        Args:
            model_name: OpenAI model name (default: gpt-4o-mini).
            temperature: Model temperature (default: 0.7).
            api_key: OpenAI API key. If None, uses OPENAI_API_KEY env var.
            
        Raises:
            ValueError: If API key is not provided and not found in environment.
        """
        if api_key is None:
            api_key = os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            raise ValueError(
                "OpenAI API key not provided. Set OPENAI_API_KEY environment variable "
                "or pass api_key parameter."
            )
        
        self.model_name = model_name
        self.temperature = temperature
        
        self.llm = ChatOpenAI(
            model=model_name,
            temperature=temperature,
            api_key=api_key
        )
        
        self.json_parser = JsonOutputParser()
    
    def execute_prompt(self, chat_template: ChatPromptTemplate, **kwargs) -> Dict[str, Any]:
        """
        Execute a chat prompt template and return parsed JSON response.
        
        Args:
            chat_template: The ChatPromptTemplate to execute.
            **kwargs: Parameters for formatting the template.
            
        Returns:
            Parsed JSON response as dictionary.
            
        Raises:
            APIException: If LLM execution fails or returns invalid JSON.
        """
        try:
            formatted_messages = chat_template.format_messages(**kwargs)
            
            response = self.llm.invoke(formatted_messages)
            
            response_text = response.content.strip()
            
            json_data = self._extract_json_from_response(response_text)
            
            return json_data
            
        except Exception as e:
            if isinstance(e, APIException):
                raise e
            
            raise APIException(
                f"LLM execution failed: {str(e)}"
            )
    
    def _extract_json_from_response(self, response_text: str) -> Dict[str, Any]:
        """
        Extract valid JSON from LLM response text.
        
        Args:
            response_text: Raw response text from LLM.
            
        Returns:
            Parsed JSON as dictionary.
            
        Raises:
            BadRequest: If no valid JSON is found in response.
        """
        try:
            return json.loads(response_text)
        except json.JSONDecodeError as e:
            raise BadRequest(
                f"Invalid JSON in LLM response. Raw response: {response_text[:500]}... Error: {str(e)}"
            )
    

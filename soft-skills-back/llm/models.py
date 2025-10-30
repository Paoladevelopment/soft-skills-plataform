"""
LLM client module for executing prompts with LangChain and OpenAI.

Handles LLM model configuration, execution, and structured response parsing.
"""

import os
from typing import Optional, Type
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from utils.errors import APIException


class LLMClient:
    """Client for executing LLM prompts and parsing structured responses."""
    
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
    
    def execute_prompt(
        self, 
        chat_template: ChatPromptTemplate, 
        response_schema: Type[BaseModel],
        **kwargs
    ) -> BaseModel:
        """
        Execute a chat prompt template and return structured response.
        
        Args:
            chat_template: The ChatPromptTemplate to execute.
            response_schema: Pydantic model class for structured output.
            **kwargs: Parameters for formatting the template.
            
        Returns:
            Structured response as Pydantic model instance.
            
        Raises:
            APIException: If LLM execution fails.
        """
        try:
            structured_llm = self.llm.with_structured_output(response_schema)
            
            formatted_messages = chat_template.format_messages(**kwargs)
            
            response = structured_llm.invoke(formatted_messages)
            
            return response
            
        except Exception as e:
            raise APIException(
                f"LLM execution failed: {str(e)}"
            )
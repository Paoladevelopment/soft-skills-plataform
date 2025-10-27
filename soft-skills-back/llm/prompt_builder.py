"""
Prompt builder module for constructing chat prompts with LangChain.

Handles building of system and user messages using ChatPromptTemplate.
"""

from langchain_core.prompts import ChatPromptTemplate
from enums.listening_game import PlayMode, Difficulty
from .prompt_loader import PromptLoader


class PromptBuilder:
    """Builds chat prompts using LangChain ChatPromptTemplate."""
    
    def __init__(self, prompt_loader: PromptLoader):
        """
        Initialize the prompt builder.
        
        Args:
            prompt_loader: Instance of PromptLoader for loading prompts.
        """
        self.prompt_loader = prompt_loader
    
    def build_chat_prompt(
        self,
        play_mode: PlayMode,
        difficulty: Difficulty
    ) -> ChatPromptTemplate:
        """
        Build a chat prompt template with system and user messages.
        
        Args:
            play_mode: The play mode for the challenge.
            difficulty: The difficulty level.
            
        Returns:
            ChatPromptTemplate ready for LLM execution.
        """
        system_prompt = self.prompt_loader.load_system_base()
        
        system_prompt = self.prompt_loader.normalize_tokens(system_prompt)
        
        user_prompt = self.prompt_loader.load_mode_prompt(play_mode, difficulty)
        
        user_prompt = self.prompt_loader.normalize_tokens(user_prompt)
        
        chat_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        return chat_template
    

"""
Prompt loader module for loading prompts from the llm/prompts directory.

Handles loading of manifest.yml, system base prompts, and mode-specific prompts.
"""

import os
import yaml
from pathlib import Path
from typing import Dict, Optional
from enums.listening_game import PlayMode, Difficulty, AudioLength
from enums.common.language import Language


class PromptLoader:
    """Loads prompts from the llm/prompts directory structure."""
    
    def __init__(self, prompts_dir: Optional[str] = None):
        """
        Initialize the prompt loader.
        
        Args:
            prompts_dir: Path to prompts directory. Defaults to llm/prompts.
        """
        if prompts_dir is None:
            current_dir = Path(__file__).parent
            self.prompts_dir = current_dir / "prompts"
        else:
            self.prompts_dir = Path(prompts_dir)
        
        if not self.prompts_dir.exists():
            raise FileNotFoundError(f"Prompts directory not found: {self.prompts_dir}")
    
    def load_manifest(self) -> Dict:
        """
        Load the manifest.yml file.
        
        Returns:
            Dictionary containing manifest data.
            
        Raises:
            FileNotFoundError: If manifest.yml doesn't exist.
            yaml.YAMLError: If manifest.yml is invalid.
        """
        manifest_path = self.prompts_dir / "manifest.yml"
        
        if not manifest_path.exists():
            raise FileNotFoundError(f"Manifest file not found: {manifest_path}")
        
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except yaml.YAMLError as e:
            raise yaml.YAMLError(f"Invalid YAML in manifest.yml: {e}")
    
    def load_system_base(self) -> str:
        """
        Load the system base prompt from base/system.txt.
        
        Returns:
            System base prompt content.
            
        Raises:
            FileNotFoundError: If system.txt doesn't exist.
        """
        system_path = self.prompts_dir / "base" / "system.txt"
        
        if not system_path.exists():
            raise FileNotFoundError(f"System base prompt not found: {system_path}")
        
        with open(system_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        return content
    
    
    def load_mode_prompt(self, play_mode: PlayMode, difficulty: Difficulty, version: str = "v1") -> str:
        """
        Load a specific mode prompt based on play_mode and difficulty.
        
        Args:
            play_mode: The play mode (focus, cloze, etc.).
            difficulty: The difficulty level (easy, intermediate, hard).
            version: The prompt version (default: v1).
            
        Returns:
            Mode-specific prompt content.
            
        Raises:
            FileNotFoundError: If the prompt file doesn't exist.
        """
        difficulty_map = {
            Difficulty.easy: "easy",
            Difficulty.intermediate: "intermediate", 
            Difficulty.hard: "hard"
        }
        
        difficulty_dir = difficulty_map.get(difficulty)
        if not difficulty_dir:
            raise ValueError(f"Unsupported difficulty: {difficulty}")
        
        prompt_path = self.prompts_dir / play_mode.value / difficulty_dir / f"{version}.txt"
        
        if not prompt_path.exists():
            raise FileNotFoundError(f"Mode prompt not found: {prompt_path}")
        
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    
    def normalize_tokens(self, text: str) -> str:
        """
        Normalize token names in prompt text.
        
        Args:
            text: Text containing potential token variations.
            
        Returns:
            Text with normalized tokens.
        """
        token_fixes = {
            "{promp_type}": "{prompt_type}",
            "{prompt_ype}": "{prompt_type}",
            "{prompt_tye}": "{prompt_type}",
        }
        
        normalized_text = text
        for typo, correct in token_fixes.items():
            normalized_text = normalized_text.replace(typo, correct)
        
        return normalized_text
    
    def load_evaluation_system_prompt(self, evaluation_type: str) -> str:
        """
        Load system prompt for evaluation tasks.
        
        Args:
            evaluation_type: The evaluation type (e.g., "clarify").
            
        Returns:
            System prompt as string.
        """
        system_path = self.prompts_dir / "evaluation" / evaluation_type / "system.txt"
        
        if not system_path.exists():
            raise FileNotFoundError(f"Evaluation system prompt not found: {system_path}")
        
        with open(system_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    
    def load_evaluation_user_prompt(self, evaluation_type: str) -> str:
        """
        Load user prompt for evaluation tasks.
        
        Args:
            evaluation_type: The evaluation type (e.g., "clarify").
            
        Returns:
            User prompt as string.
        """
        user_path = self.prompts_dir / "evaluation" / evaluation_type / "user.txt"
        
        if not user_path.exists():
            raise FileNotFoundError(f"Evaluation user prompt not found: {user_path}")
        
        with open(user_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
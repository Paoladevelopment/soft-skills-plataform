from typing import List


class ListeningGameService:
    """Service class for managing Active Listening / Codebreakers game logic"""
    
    def create_room(self, owner_user_id: str, config_in: dict):
        """
        Create a new game room with the specified configuration.
        
        Args:
            owner_user_id: UUID of the user creating the room
            config_in: Dictionary containing room configuration settings
            
        Returns:
            Created room instance with configuration
        """
        pass
    
    def join_room(self, room_id: str, user_id: str):
        """
        Add a user to an existing game room.
        
        Args:
            room_id: UUID of the room to join
            user_id: UUID of the user joining
            
        Returns:
            Updated room state with user added
        """
        pass
    
    def start_game(self, room_id: str):
        """
        Start the game for a room, transitioning from lobby to active state.
        
        Args:
            room_id: UUID of the room to start
            
        Returns:
            Game instance with initial round setup
        """
        pass
    
    def start_round(self, game_id: str, round_number: int):
        """
        Initialize a new round for the game with challenges for each team.
        
        Args:
            game_id: UUID of the game
            round_number: The round number to start
            
        Returns:
            Round instance with team assignments
        """
        pass
    
    def get_listener_view(self, round_team_id: str):
        """
        Get the listener's view of their current round challenge.
        
        Args:
            round_team_id: UUID of the round team instance
            
        Returns:
            Listener view with forbidden words, audio clip, and playback info
        """
        pass
    
    def post_listener_message(self, round_team_id: str, user_id: str, content: str):
        """
        Post a message from the listener to help decoders guess the answer.
        
        Args:
            round_team_id: UUID of the round team instance
            user_id: UUID of the listener posting the message
            content: The message content
            
        Returns:
            Created message with any violation flags
        """
        pass
    
    def get_decoder_view(self, round_team_id: str):
        """
        Get the decoder's view of the current round with messages and choices.
        
        Args:
            round_team_id: UUID of the round team instance
            
        Returns:
            Decoder view with messages, answer choices, and voice room info
        """
        pass
    
    def submit_answer(self, round_team_id: str, user_id: str, selected_answer: str):
        """
        Submit a decoder's answer for the current round.
        
        Args:
            round_team_id: UUID of the round team instance
            user_id: UUID of the decoder submitting
            selected_answer: The chosen answer from available choices
            
        Returns:
            Answer submission with timing information
        """
        pass
    
    def score_round_team(self, round_team_id: str):
        """
        Calculate and record the score for a team's round performance.
        
        Args:
            round_team_id: UUID of the round team instance
            
        Returns:
            Score breakdown with base points, bonuses, and penalties
        """
        pass
    
    # Helper methods
    
    def detect_violations(self, text: str, forbidden_words: List[str]) -> List[str]:
        """
        Check if a message contains any forbidden words.
        
        Args:
            text: The message text to check
            forbidden_words: List of words that are not allowed
            
        Returns:
            List of forbidden words found in the text
        """
        pass
    
    def sum_penalties(self, round_team_id: str) -> int:
        """
        Calculate total penalty points for a round team.
        
        Args:
            round_team_id: UUID of the round team instance
            
        Returns:
            Total penalty points (negative value)
        """
        pass

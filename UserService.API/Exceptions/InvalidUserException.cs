namespace UserService.API.Exceptions
{
    public class InvalidUserException : Exception
    {
        public InvalidUserException(string message) : base(message) { }
    }
}

namespace UserService.API.Exceptions
{
    public class InvalidFieldProvidedException : Exception
    {
        public InvalidFieldProvidedException(string message) : base($"Invalid {message} provided") { }
    }
}

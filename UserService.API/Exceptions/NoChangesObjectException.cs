namespace UserService.API.Exceptions
{
    public class NoChangesObjectException : Exception
    {
        public NoChangesObjectException(string message) : base(message) {}
    }
}

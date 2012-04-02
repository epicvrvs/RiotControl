namespace RiotControl
{
	public class Login
	{
		public string Username;
		public string Password;

		public Login()
		{
		}

		public Login(string username, string password)
		{
            string tempUsername;

            //Removes spaces and uppercase characters from the provided username
            tempUsername = username.Replace(" ", string.Empty);
            Username = tempUsername.ToLower() ;
			Password = password;
		}
	}
}

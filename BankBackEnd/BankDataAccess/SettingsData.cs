using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankDataAccess
{
    static public class SettingsData
    {
        static public string ConnectionString { get { return Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"); } }
    }
}

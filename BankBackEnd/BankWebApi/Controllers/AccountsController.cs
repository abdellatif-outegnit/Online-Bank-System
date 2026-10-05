using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/Accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{customerID}")]
        public IActionResult GetAllAccountsByCustomerID(int customerID)
        {

            if(customerID <= 0) {

                return BadRequest("Customer ID is invalid.");
            }
            var accounts = Accounts.GetAllAccountsByCustomerID(customerID);

            return Ok(accounts);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("Add")]
        public IActionResult AddAccount([FromBody]int AccountType)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            Accounts account = new Accounts();

            bool status = account.AddNewAccount(userIdInt, AccountType);

            if(status == true)
                return Ok("Account Added successfully");
            else
                return BadRequest("This Account Type Already exist");
        }
    }
}

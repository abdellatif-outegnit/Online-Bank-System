using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/Transfers")]
    [ApiController]
    public class TransfersController : ControllerBase
    {
        public class TransferRequest
        {
            public string FromAccount { get; set; }
            public string ToAccount { get; set; }
            public decimal Amount { get; set; }
        }

        public class DepositAndWithdrawRequest
        {
            public string AccountNumber { get; set; }
            public decimal Amount { get; set; }
        }

        public class TransferFiltredRequest
        {
            public List<byte> TransType { get; set; } = new List<byte>();

            public byte? AccountType { get; set; }

            public byte? status { get; set; }

            public DateTime? FromDate { get; set; }

            public DateTime? ToDate { get; set; }

            public int pageNumber { get; set; } = 1;

            public int pageSize { get; set; } = 5;
  
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost]
        public IActionResult Transfer([FromBody] TransferRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if(string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (request.ToAccount == null || request.Amount <= 0 || request.FromAccount == null)
            {
                return BadRequest("Invalid transfer request.");
            }

            if (Transactions.Transfer(userIdInt, request.FromAccount, request.ToAccount, request.Amount))
            {
                return Ok("Transfer successful.");
            }
        
            return BadRequest("Transfer failed.");
            
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("Deposit")]
        public IActionResult Deposit([FromBody] DepositAndWithdrawRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (Transactions.Deposit(userIdInt, request.AccountNumber, request.Amount))
            {
                return Ok("Deposit has been done successfully.");
            }

            return BadRequest("Deposit failed.");

        }



        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("Withdraw")]
        public IActionResult Withdraw([FromBody] DepositAndWithdrawRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (Transactions.Withdraw(userIdInt, request.AccountNumber, request.Amount))
            {
                return Ok("Withdraw has been done successfully.");
            }

            return BadRequest("Withdraw failed.");

        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("All")]
        public IActionResult GetTransfers()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

          
            return Ok(Transactions.GetAllTransactionByUser(userIdInt));

        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("Customer/{pageNumber}")]
        public async Task<IActionResult> GetTransfersUsingCustomerID(int pageNumber)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            var result = Transactions.getAllTransactionsUsingCustomerID(userIdInt, pageNumber);

            if (result == null)
            {
                return NotFound();  
            }

            return Ok(await result);

        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("Customer/filtred")]
        public async Task<IActionResult> GetFiltredTransfersUsingCustomerID([FromBody] TransferFiltredRequest reqData)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            var result = Transactions.getAllFilteredTransactionsUsingCustomerID(userIdInt ,reqData.pageNumber, reqData.TransType, reqData.pageSize, reqData.AccountType, reqData.status, reqData.FromDate, reqData.ToDate);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(await result);

        }
    }
}

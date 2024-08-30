using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using retold_server.api.Contracts.BlockContracts;
using retold_server.api.Contracts.BlockContracts.ConsultationContracts;
using retold_server.api.Contracts.BlockContracts.ScheduleContracts;
using retold_server.domain.Abstractions;
using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlocksController : ControllerBase
    {
        private readonly IBlocksService blocksService;

        public BlocksController(IBlocksService blocksService)
        {
            this.blocksService = blocksService;
        }

        private int GetUserByToken()
        {
            var userIdClaim = HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userIdFromToken))
            {
                return 0;
            }
            return userIdFromToken;
        }

        [HttpGet("get-all-blocks")]
        public async Task<IActionResult> GetAllBlocks()
        {
            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var blocksDto = await this.blocksService.GetAllBlockByUserId(userIdFromToken);
            if(blocksDto == null || !blocksDto.Any()) { return NotFound("Blocks not found"); }

            return Ok(blocksDto);
        }

        [HttpGet("{blockId:int}/get-block")]
        public async Task<IActionResult> GetBlockById(int blockId)
        {
            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var blockDto = await this.blocksService.GetBlockById(blockId, userIdFromToken);
            if (blockDto == null) { return NotFound("Blocks not found"); }

            return Ok(blockDto);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBlock([FromBody] CreateBlockRequest request) 
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var blockId = await this.blocksService.CreateBlock(userIdFromToken, request.Title, request.Description);
            return Ok(blockId);
        }

        [HttpPut("update-title/{blockId:int}")]
        public async Task<IActionResult> UpdateTitleBlock(int blockId, [FromBody] UpdateTitleBlockRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            string? resultTitle = await this.blocksService.UpdateTitleBlock(blockId, userIdFromToken, request.newTitle);
            if (resultTitle == null) { return NotFound("Block not found"); }

            return Ok(resultTitle);
        }

        [HttpPut("update-description/{blockId:int}")]
        public async Task<IActionResult> UpdateDescriptionBlock(int blockId, [FromBody] UpdateDescriptionBlockRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            string? resultDescription = await this.blocksService.UpdateDescriptionBlock(blockId, userIdFromToken, request.newDescription);
            if (resultDescription == null) { return NotFound("Block not found"); }

            return Ok(resultDescription);
        }

        [HttpDelete("delete-block/{blockId:int}")]
        public async Task<IActionResult> DeleteBlock(int blockId)
        {
            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            bool? resultDelete = await this.blocksService.DeleteBlock(blockId, userIdFromToken);
            if (resultDelete == null) { return NotFound("Block not found"); }

            return Ok("The block was successfully deleted");
        }

        [HttpGet("{blockId:int}/get-schedules")]
        public async Task<IActionResult> GetAllSchedules(int blockId)
        {
            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var blockDto = await this.blocksService.GetBlockById(blockId, userIdFromToken);
            if (blockDto == null) { return NotFound("Blocks not found"); }

            var schedulesDto = await this.blocksService.GetAllSchedules(blockId, userIdFromToken);
            if (schedulesDto == null || !schedulesDto.Any() ) { return NotFound("Schedules not found"); }

            return Ok(schedulesDto);
        }

        [HttpPost("{blockId:int}/add-schedule")]
        public async Task<IActionResult> AddScheduleToBlock(int blockId, [FromBody] AddScheduleRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var schedule = new Schedule(
                id: 0,
                blockId: blockId,
                typeWeek: request.TypeWeek,
                day: request.Day,
                timeStart: request.TimeStart,
                timeEnd: request.TimeEnd,
                title: request.Title,
                lessonType: request.LessonType,
                cabinet: request.Cabinet,
                linkFirst: request.LinkFirst,
                linkSecond: request.LinkSecond);

            var result = await this.blocksService.AddScheduleToBlock(blockId, userIdFromToken, schedule);
            if (!result) { return NotFound("Block not found"); }

            return Ok("Schedule successfully added to the block.");
        }

        [HttpPut("{blockId:int}/update-schedule")]
        public async Task<IActionResult> UpdateScheduleInBlock(int blockId, [FromBody] UpdateScheduleRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var schedule = new Schedule(
                id: request.Id,
                blockId: blockId,
                typeWeek: request.TypeWeek,
                day: request.Day,
                timeStart: request.TimeStart,
                timeEnd: request.TimeEnd,
                title: request.Title,
                lessonType: request.LessonType,
                cabinet: request.Cabinet,
                linkFirst: request.LinkFirst,
                linkSecond: request.LinkSecond);

            var result = await this.blocksService.UpdateSchedule(userIdFromToken, schedule);
            if (!result) { return NotFound("Schedule not found"); }

            return Ok("Schedule successfully updated in the block.");
        }

        [HttpDelete("{blockId:int}/delete-schedule")]
        public async Task<IActionResult> DeleteScheduleInBlock(int blockId, [FromBody] DeleteScheduleRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var result = await this.blocksService.DeleteSchedule(request.Id, blockId, userIdFromToken);
            if (!result) { return NotFound("Schedule not found"); }

            return Ok("Schedule successfully deleted in the block.");
        }

        [HttpGet("{blockId:int}/get-consultations")]
        public async Task<IActionResult> GetAllConsultations(int blockId)
        {
            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var blockDto = await this.blocksService.GetBlockById(blockId, userIdFromToken);
            if (blockDto == null) { return NotFound("Blocks not found"); }

            var consultationsDto = await this.blocksService.GetAllConsultations(blockId, userIdFromToken);
            if (consultationsDto == null || !consultationsDto.Any()) { return NotFound("Consultations not found"); }

            return Ok(consultationsDto);
        }

        [HttpPost("{blockId:int}/add-consultation")]
        public async Task<IActionResult> AddConsultationToBlock(int blockId, [FromBody] AddConsultationRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var consultation = new Consultation(
                id: 0,
                blockId: blockId,
                title: request.Title,
                teacherName: request.TeachersName,
                day: request.Day,
                timeStart: request.TimeStart,
                cabinet: request.Cabinet,
                link: request.Link);

            var result = await this.blocksService.AddConsultationToBlock(blockId, userIdFromToken, consultation);
            if (!result) { return NotFound("Block not found"); }

            return Ok("Consultation successfully added to the block.");
        }

        [HttpPut("{blockId:int}/update-consultation")]
        public async Task<IActionResult> UpdateConsultationInBlock(int blockId, [FromBody] UpdateConsultationRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var consultation = new Consultation(
                id: request.Id,
                blockId: blockId,
                title: request.Title,
                teacherName: request.TeachersName,
                day: request.Day,
                timeStart: request.TimeStart,
                cabinet: request.Cabinet,
                link: request.Link);

            var result = await this.blocksService.UpdateConsultation(userIdFromToken, consultation);
            if (!result) { return NotFound("Consultation not found"); }

            return Ok("Consultation successfully updated in the block.");
        }

        [HttpDelete("{blockId:int}/delete-consultation")]
        public async Task<IActionResult> DeleteConsultationInBlock(int blockId, [FromBody] DeleteConsultationRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdFromToken = GetUserByToken();
            if (userIdFromToken == 0) { return Unauthorized(); }

            var result = await this.blocksService.DeleteConsultation(request.Id, blockId, userIdFromToken);
            if (!result) { return NotFound("Consultation not found"); }

            return Ok("Consultation successfully deleted in the block.");
        }
    }
}

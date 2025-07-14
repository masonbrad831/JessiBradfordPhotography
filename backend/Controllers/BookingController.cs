using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JessiBradfordPhotographyApi.Data;
using JessiBradfordPhotographyApi.Models;
using JessiBradfordPhotographyApi.DTOs;

namespace JessiBradfordPhotographyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BookingController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/photos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBooking()
    {
        var bookings = await _context.Booking
            .Select(b => new Booking
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                ImageUrl = b.ImageUrl,
                Category = b.Category,
                Featured = b.Featured,
                Tags = b.Tags,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(bookings);
    }
}
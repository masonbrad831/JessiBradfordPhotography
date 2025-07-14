using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JessiBradfordPhotographyApi.Data;
using JessiBradfordPhotographyApi.Models;
using JessiBradfordPhotographyApi.DTOs;

namespace JessiBradfordPhotographyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhotosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PhotosController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/photos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PhotoDto>>> GetPhotos()
    {
        var photos = await _context.Photos
            .Select(p => new PhotoDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                Category = p.Category,
                Featured = p.Featured,
                Tags = p.Tags,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return Ok(photos);
    }

    // GET: api/photos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PhotoDto>> GetPhoto(int id)
    {
        var photo = await _context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }

        var photoDto = new PhotoDto
        {
            Id = photo.Id,
            Title = photo.Title,
            Description = photo.Description,
            ImageUrl = photo.ImageUrl,
            Category = photo.Category,
            Featured = photo.Featured,
            Tags = photo.Tags,
            CreatedAt = photo.CreatedAt
        };

        return Ok(photoDto);
    }

    // POST: api/photos
    [HttpPost]
    public async Task<ActionResult<PhotoDto>> CreatePhoto(CreatePhotoDto createPhotoDto)
    {
        var photo = new Photo
        {
            Title = createPhotoDto.Title,
            Description = createPhotoDto.Description,
            ImageUrl = createPhotoDto.ImageUrl,
            Category = createPhotoDto.Category,
            Featured = createPhotoDto.Featured,
            Tags = createPhotoDto.Tags
        };

        _context.Photos.Add(photo);
        await _context.SaveChangesAsync();

        var photoDto = new PhotoDto
        {
            Id = photo.Id,
            Title = photo.Title,
            Description = photo.Description,
            ImageUrl = photo.ImageUrl,
            Category = photo.Category,
            Featured = photo.Featured,
            Tags = photo.Tags,
            CreatedAt = photo.CreatedAt
        };

        return CreatedAtAction(nameof(GetPhoto), new { id = photo.Id }, photoDto);
    }

    // PUT: api/photos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePhoto(int id, UpdatePhotoDto updatePhotoDto)
    {
        var photo = await _context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }

        photo.Title = updatePhotoDto.Title;
        photo.Description = updatePhotoDto.Description;
        photo.ImageUrl = updatePhotoDto.ImageUrl;
        photo.Category = updatePhotoDto.Category;
        photo.Featured = updatePhotoDto.Featured;
        photo.Tags = updatePhotoDto.Tags;
        photo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/photos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
        var photo = await _context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }

        _context.Photos.Remove(photo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
} 
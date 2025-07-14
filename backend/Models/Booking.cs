using System.ComponentModel.DataAnnotations;

namespace JessiBradfordPhotographyApi.Models;

public class Booking
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string ClientName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(1000)]
    public string? SpecialRequests { get; set; }

    [Required]
    [MaxLength(200)]
    public string Service { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Time { get; set; } = string.Empty;
    
    [Required]
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    
    [MaxLength(1000)]
    public string? Notes { get; set; }
    
    
    
    
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled
} 
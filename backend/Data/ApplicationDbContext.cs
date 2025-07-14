using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JessiBradfordPhotographyApi.Models;

namespace JessiBradfordPhotographyApi.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Photo> Photos { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ClientGallery> ClientGalleries { get; set; }
    public DbSet<SlideshowImage> SlideshowImages { get; set; }
    public DbSet<FeaturedWork> FeaturedWorks { get; set; }
    public DbSet<Availability> Availabilities { get; set; }
    public DbSet<TimeSlot> TimeSlots { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Photo entity
        builder.Entity<Photo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Tags).HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
        });

        // Configure Service entity
        builder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Includes).HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
        });

        // Configure ClientGallery entity
        builder.Entity<ClientGallery>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasMany(e => e.Photos)
                  .WithOne()
                  .HasForeignKey("ClientGalleryId");
        });

        // Configure Availability entity
        builder.Entity<Availability>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasMany(e => e.TimeSlots)
                  .WithOne(e => e.Availability)
                  .HasForeignKey(e => e.AvailabilityId);
        });

        // Configure TimeSlot entity
        builder.Entity<TimeSlot>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }
} 
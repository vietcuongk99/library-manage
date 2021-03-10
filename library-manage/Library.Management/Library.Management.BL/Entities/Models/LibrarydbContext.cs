﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Library.Management.BL.Models
{
    public partial class LibrarydbContext : DbContext
    {
        public static string Connectionstring = string.Empty;
        public LibrarydbContext()
        {
        }

        public LibrarydbContext(DbContextOptions<LibrarydbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Book> Book { get; set; }
        public virtual DbSet<BookBorrow> BookBorrow { get; set; }
        public virtual DbSet<BookCategory> BookCategory { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql(Connectionstring, x => x.ServerVersion("10.1.47-mariadb"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasComment("Bảng danh sách các sách trong hệ thống");

                entity.HasIndex(e => e.BookCategoryId)
                    .HasName("FK_Book_BookCategoryID");

                entity.Property(e => e.BookId)
                    .HasColumnName("BookID")
                    .HasComment("Khóa chính")
                    .ValueGeneratedNever()
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.ActivedBook)
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'0'")
                    .HasComment("Số sách đã mượn");

                entity.Property(e => e.Amount)
                    .HasColumnType("int(11)")
                    .HasComment("Số lượng sách");

                entity.Property(e => e.AmountPage)
                    .HasColumnType("int(11)")
                    .HasComment("Tổng số trang");

                entity.Property(e => e.BookAuthor)
                    .HasColumnType("varchar(255)")
                    .HasComment("Tác giả")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.BookCategoryId)
                    .HasColumnName("BookCategoryID")
                    .HasComment("Tên loại sách")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.BookCode)
                    .HasColumnType("char(20)")
                    .HasComment("Mã sách")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.BookName)
                    .IsRequired()
                    .HasColumnType("varchar(255)")
                    .HasComment("Tên sách")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasColumnType("varchar(255)")
                    .HasDefaultValueSql("'admin'")
                    .HasComment("Người tạo")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .HasComment("Ngày tạo");

                entity.Property(e => e.Description)
                    .HasColumnType("varchar(255)")
                    .HasComment("Mô tả")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasComment("Ngày sửa")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnType("datetime")
                    .HasComment("Người sửa");

                entity.Property(e => e.Status)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'")
                    .HasComment("Trạng thái: 1 - còn sử dụng; 0 - không sử dụng;");

                entity.Property(e => e.YearOfPublication)
                    .HasColumnType("int(11)")
                    .HasComment("Năm xuất bản");

                entity.HasOne(d => d.BookCategory)
                    .WithMany(p => p.Book)
                    .HasForeignKey(d => d.BookCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Book_BookCategoryID");
            });

            modelBuilder.Entity<BookBorrow>(entity =>
            {
                entity.HasComment("Thông tin mượn - trả sách");

                entity.Property(e => e.BookBorrowId)
                    .HasColumnName("BookBorrowID")
                    .HasDefaultValueSql("''")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.BookId)
                    .HasColumnName("BookID")
                    .HasDefaultValueSql("''")
                    .HasComment("id sách")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.BorrowDate)
                    .HasColumnType("datetime")
                    .HasComment("ngày mượn");

                entity.Property(e => e.BorrowStatus)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'")
                    .HasComment("trạng thái mượn sách: 0 - không mượn, 1 - đang mượn");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasComment("người tạo")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .HasComment("ngày tạo");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasComment("người sửa")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnType("datetime")
                    .HasComment("ngày sửa");

                entity.Property(e => e.ReturnDate)
                    .HasColumnType("datetime")
                    .HasComment("ngày trả");

                entity.Property(e => e.ReturnStatus)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'")
                    .HasComment("trạng thái trả sách: 0 - chưa trả, 1 - đã trả");

                entity.Property(e => e.Status)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'")
                    .HasComment("trạng thái bản ghi: 0 ");

                entity.Property(e => e.UserId)
                    .HasColumnName("UserID")
                    .HasDefaultValueSql("''")
                    .HasComment("id người dùng mượn - trả sách")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");
            });

            modelBuilder.Entity<BookCategory>(entity =>
            {
                entity.HasComment("Thể loại sách");

                entity.Property(e => e.BookCategoryId)
                    .HasColumnName("BookCategoryID")
                    .HasComment("Khóa chính")
                    .ValueGeneratedNever()
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.Amount)
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'0'")
                    .HasComment("Số lượng loại sách");

                entity.Property(e => e.BookCategoryName)
                    .HasColumnType("varchar(255)")
                    .HasComment("Tên thể loại sách")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_unicode_ci");

                entity.Property(e => e.Status)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'")
                    .HasComment("Trạng thái");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

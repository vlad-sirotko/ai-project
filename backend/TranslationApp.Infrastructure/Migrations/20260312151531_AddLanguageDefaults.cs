using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TranslationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefaultSource",
                table: "SupportedLanguages",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDefaultTarget",
                table: "SupportedLanguages",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDefaultSource",
                table: "SupportedLanguages");

            migrationBuilder.DropColumn(
                name: "IsDefaultTarget",
                table: "SupportedLanguages");
        }
    }
}

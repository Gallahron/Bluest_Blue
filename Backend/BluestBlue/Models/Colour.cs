using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BluestBlue.Models
{
    public class Colour
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int TransactionID { get; set; }
        public int UserID { get; set; }
        public decimal Hue { get; set; }
        public decimal Sat { get; set; }
        public decimal Val { get; set; }
        public int Count { get; set; }
    }
}

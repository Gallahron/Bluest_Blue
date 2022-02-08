namespace BluestBlue.Models
{
    public class GraphGenProps
    {
        public int userID { get; set; }
        public decimal[] hue { get; set; }
        public decimal[] lightness { get; set;}
        public decimal hueDist { get; set; }
        public decimal lightnessDist { get; set; }
    }
}

#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BluestBlue.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Cors;

namespace BluestBlue.Controllers
{
    [Route("api/blueblue")]
    [ApiController]
    public class BlueblueController : ControllerBase
    {
        private readonly BlueBlueContext _context;

        public BlueblueController(BlueBlueContext context)
        {
            _context = context;
        }


        // GET: api/TodoItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Colour>>> GetColours()
        {
            Console.WriteLine("RequestRecieved");
            return await _context.Colours.ToListAsync();
        }

        // GET: api/TodoItems/count/5/3/2
        [HttpGet("count/{hue}/{sat}/{val}")]
        public async Task<ActionResult<decimal>> GetColour(decimal hue, decimal sat, decimal val)
        {
            var userColours = _context.Colours.Where(
                o => ( o.Hue == hue && o.Sat == sat && o.Val == val)
            );
            int tot = 0;
            await userColours.ForEachAsync(
                o => {
                    tot += o.Count;
                }
            );

            return tot;
        }
        // GET: api/TodoItems/count/5/3/2
        [HttpGet("userEntry/{userID}/{hue}/{sat}/{val}")]
        public async Task<ActionResult<Colour>> GetUserEntry(int userID, decimal hue, decimal sat, decimal val)
        {
            var userColours = _context.Colours.Where(
                o => (o.UserID == userID && o.Hue == hue && o.Sat == sat && o.Val == val)
            );

            return await userColours.FirstOrDefaultAsync();
        }

        // PUT: api/TodoItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("addColour")]
        public async Task<ActionResult<bool>> UpdateColour(
            UserColour props
        )
        {
            if (EntryExists(props.userID, props.hue, props.sat, props.val))
            {
                EntityEntry entry = _context.Entry(GetUserEntry(props.userID, props.hue, props.sat, props.val).Result.Value);
                entry.Member("Count").CurrentValue = Convert.ToInt32(entry.Member("Count").CurrentValue) + 1;
                entry.State = EntityState.Modified;
            }
            else {
                _context.Colours.Add(new Colour() { 
                    UserID = props.userID,
                    Hue = props.hue,
                    Sat = props.sat,
                    Val = props.val,
                    Count = 1
                });
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }

            return true;
        }
        [HttpPost("getHexGrid")]
        public async Task<ActionResult<int[]>> GetHexGrid(GraphGenProps props) {
            List<int> counts = new List<int>();
            var colours = _context.Colours.Where(
                o => (o.UserID == props.userID)
            ).ToList();
            for (int i = 0; i < props.hue.Length; i++) {
                int count = 0;
                var hex = colours.Where(
                    o => (o.UserID == props.userID && Math.Abs(o.Hue - props.hue[i]) < props.hueDist && Math.Abs(o.Val - props.lightness[i]) < props.lightnessDist)
                );
                hex.ToList().ForEach(o => count += o.Count);

                const int MIN_LIGHTNESS = 0;
                const int MAX_LIGHTNESS = 100;

                decimal distMin = props.lightness[i] - MIN_LIGHTNESS;
                decimal distMax = MAX_LIGHTNESS - props.lightness[i];

                float spill = 0;
                if (distMin < props.lightnessDist && distMin < distMax)
                {
                    spill = (float)(props.lightnessDist - distMin);
                }
                else if (distMax < props.lightnessDist && distMax < distMin) {
                    spill = (float)(props.lightnessDist - distMax);
                }

                if (spill != 0) {
                    float rad = (float)props.lightnessDist;

                    float width = MathF.Sqrt(
                        (float)(rad * rad - spill * spill)
                    );

                    float perc = width * spill + spill * rad;

                    perc /= rad * rad * MathF.PI / 2;

                    /* r = props.lightnessDist
                     * h = spill
                     * 
                     * perc = h * (r^2 - h^2 + r)
                     * */
                    
                    count += (int)(count * perc);
                    Console.WriteLine(props.lightness[i].ToString() + " a " + perc.ToString());
                }
                
                counts.Add(count);
            }

            return counts.ToArray();
        }

        [HttpGet("UserID")]
        public async Task<ActionResult<long>> GenUserID() {
            long time = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds();
            const int SECS_IN_YEAR = 31536000;
            time %= SECS_IN_YEAR * 10;
            time += (new Random()).Next(SECS_IN_YEAR * 10, SECS_IN_YEAR * 15);
               

            return time;
        }

        private bool EntryExists(int userID, decimal hue, decimal sat, decimal val)
        {
            return _context.Colours.Any(
                e =>  (e.UserID == userID && e.Hue == hue && e.Sat == sat && e.Val == val));
        }

        /*// POST: api/TodoItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Color>> PostTodoItem(Color todoItem)
        {
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        */
    }
}

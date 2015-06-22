import Foundation

var inside = 0
var total = 0

let radius = 300.0
let radius_sq = radius * radius

while true {
	let x = ((Double(arc4random())/Double(UInt32.max)) * 2.0 * radius) - radius
	let y = ((Double(arc4random())/Double(UInt32.max)) * 2.0 * radius) - radius
	
	if (x*x + y*y < radius_sq) {
		inside++
	}
	
	total++
	
	if (total % 100000000 == 0) {
		let pi: Double = 4*Double(inside)/Double(total)
		println("\(total) (\(inside)): \(pi)")
	}
}

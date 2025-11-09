
const collaborators = [
	"Let Africa Build (LAB)",
	"Lagos Food Bank Initiative (LFBI)",
	"Local Ambassadors & Volunteers",
]

export default function Collaborations() {
	return (
		<section className="w-full text-foreground py-12 mb-12">
			{/* Inline styles for marquee animation scoped to this component */}
			<style>{`
				.collab-marquee{ display:flex; gap:4rem; align-items:center; }
				.collab-track{ display:flex; gap:4rem; align-items:center; }
				.collab-wrap{ overflow:hidden; width:100%; }
				.collab-marquee, .collab-track{ will-change:transform }
				.collab-anim{ animation:collab-scroll 18s linear infinite; }

				@keyframes collab-scroll{ 
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}

				/* Make the animation slower on larger screens */
				@media (min-width: 1024px){
					.collab-anim { animation-duration: 22s }
				}

				/* Reduce gap and size on small screens */
				@media (max-width: 640px){
					.collab-marquee { gap:1.25rem }
				}
			`}</style>

			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 md:mb-12">Collaborations</h2>

				<div className="collab-wrap">
					<div className="collab-marquee collab-anim">
						{/* two copies for seamless looping */}
						<div className="collab-track">
							{collaborators.map((c, i) => (
								<div key={i} className="flex items-center gap-2 whitespace-nowrap">
									<div className="w-6 h-6 bg-white rounded-sm flex-shrink-0" aria-hidden="true" />
									<span className="text-md md:text-lg font-regular">{c}</span>
								</div>
							))}
						</div>

						<div className="collab-track" aria-hidden>
							{collaborators.map((c, i) => (
								<div key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap">
									<div className="w-6 h-6 bg-white rounded-sm flex-shrink-0" aria-hidden="true" />
									<span className="text-md md:text-lg font-regular">{c}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

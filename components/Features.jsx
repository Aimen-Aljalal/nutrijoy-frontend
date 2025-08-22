const features = [
  {
    title: "Accurate Calorie Calculations",
    description: "Get personalized calorie targets based on your body and goals.",
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 12c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7 7 3.134 7 7z"
        ></path>
      </svg>
    ),
  },
  {
    title: "Healthy Meal Suggestions",
    description: "Automatically get meals tailored to your calorie needs and preferences.",
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5l7 7-7 7"
        ></path>
      </svg>
    ),
  },
  {
    title: "Save & Track Plans",
    description: "Keep your daily and weekly meal plans organized and accessible anytime.",
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7h18M3 12h18M3 17h18"
        ></path>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-3">
        {features.map(({ title, description, icon }, idx) => (
          <div
            key={idx}
            className="bg-green-50 rounded-lg p-8 text-center shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">{title}</h3>
            <p className="text-green-800">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

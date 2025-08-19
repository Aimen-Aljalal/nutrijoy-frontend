export default function HowItWorks() {
  const steps = [
    {
      title: "Register Your Profile",
      description: "Enter your height, weight, age, and goals to get personalized plans.",
      icon: (
        <svg
          className="w-12 h-12 text-green-600 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: "Get Custom Meal Plans",
      description: "Receive daily meal suggestions tailored to your calorie needs.",
      icon: (
        <svg
          className="w-12 h-12 text-green-600 mb-4"
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
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 12c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7 7 3.134 7 7z"
          />
        </svg>
      ),
    },
    {
      title: "Track Your Progress",
      description: "Save your meal plans and monitor your health improvements over time.",
      icon: (
        <svg
          className="w-12 h-12 text-green-600 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-green-50 py-20 px-6 md:px-16 text-center">
      <h2 className="text-3xl font-extrabold text-green-900 mb-12">How It Works</h2>
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3">
        {steps.map(({ title, description, icon }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow p-8 flex flex-col items-center"
          >
            {icon}
            <h3 className="text-xl font-semibold text-green-800 mb-3">{title}</h3>
            <p className="text-green-700">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

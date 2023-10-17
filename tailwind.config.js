/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./srcs/*.{ts,tsx}"],
    theme: {
        extend: {
            backgroundColor: {
                "pale-blue": "#b2c6e4",
            },
            borderRadius: {
                canvas: "40px",
            },
        },
    },
};

// A hint gomb interaktivitása (például egy alert üzenet)
document.addEventListener('DOMContentLoaded', () => {
    const hintButton = document.querySelector('.hint-button');
    const solutionInput = document.querySelector('.solution-input');
    const submitButton = document.querySelector('.submit-button');

    hintButton.addEventListener('click', () => {
        alert('Hint: Look for the big tree by the water on the west side!');
    });

    submitButton.addEventListener('click', () => {
        const solution = solutionInput.value.trim();
        if (solution.toLowerCase() === 'gnome') { // Példa megoldás
            alert('Correct! You found the gnome!');
        } else if (solution === '') {
            alert('Please enter your solution.');
        } else {
            alert('Incorrect solution. Try again!');
        }
    });
});
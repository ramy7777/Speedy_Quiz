const specialQuestion = {
    question: "Who is the star couple of the night?",
    options: ["Ramy & Zeina", "Imad & Doaa", "Samer & Lara", "Amjad & Nancy"],
    correct: 1,
    isSpecial: true
};

const allQuestions = [
    {
        question: "Which city will host the 2024 Summer Olympics?",
        options: ["London", "Tokyo", "Paris", "Los Angeles"],
        correct: 2
    },
    {
        question: "What is the capital of New Zealand?",
        options: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correct: 1
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
        correct: 1
    },
    {
        question: "Which element has the chemical symbol 'Au'?",
        options: ["Silver", "Copper", "Gold", "Aluminum"],
        correct: 2
    },
    {
        question: "What year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    },
    {
        question: "What is the capital of Brazil?",
        options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1
    },
    {
        question: "Who is known as the father of modern physics?",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
        correct: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correct: 2
    },
    {
        question: "In which year did the Berlin Wall fall?",
        options: ["1987", "1988", "1989", "1990"],
        correct: 2
    },
    {
        question: "What is the chemical formula for water?",
        options: ["CO2", "H2O", "O2", "N2"],
        correct: 1
    },
    {
        question: "Who painted 'The Starry Night'?",
        options: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Salvador Dalí"],
        correct: 2
    },
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
    },
    {
        question: "Which country invented pizza?",
        options: ["Greece", "Spain", "France", "Italy"],
        correct: 3
    },
    {
        question: "What is the smallest planet in our solar system?",
        options: ["Mars", "Venus", "Mercury", "Pluto"],
        correct: 2
    },
    {
        question: "Who wrote '1984'?",
        options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
        correct: 0
    },
    {
        question: "What is the capital of South Korea?",
        options: ["Busan", "Seoul", "Incheon", "Daegu"],
        correct: 1
    },
    {
        question: "Which element is most abundant in Earth's atmosphere?",
        options: ["Oxygen", "Carbon", "Nitrogen", "Hydrogen"],
        correct: 2
    },
    {
        question: "Who discovered penicillin?",
        options: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Joseph Lister"],
        correct: 0
    },
    {
        question: "What is the longest river in the world?",
        options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
        correct: 1
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["1910", "1911", "1912", "1913"],
        correct: 2
    },
    {
        question: "Who is the author of 'Harry Potter'?",
        options: ["J.R.R. Tolkien", "C.S. Lewis", "J.K. Rowling", "Roald Dahl"],
        correct: 2
    },
    {
        question: "What is the capital of Egypt?",
        options: ["Alexandria", "Cairo", "Luxor", "Giza"],
        correct: 1
    },
    {
        question: "Which planet has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 1
    },
    {
        question: "Who painted the Sistine Chapel ceiling?",
        options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
        correct: 2
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2
    },
    {
        question: "Which country is home to the Great Barrier Reef?",
        options: ["Brazil", "Indonesia", "Philippines", "Australia"],
        correct: 3
    },
    {
        question: "Who invented the telephone?",
        options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"],
        correct: 1
    },
    {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        correct: 3
    },
    {
        question: "Which is the largest desert in the world?",
        options: ["Sahara Desert", "Antarctic Desert", "Arctic Desert", "Gobi Desert"],
        correct: 1
    },
    {
        question: "Who wrote 'The Divine Comedy'?",
        options: ["Dante Alighieri", "Giovanni Boccaccio", "Francesco Petrarch", "Niccolò Machiavelli"],
        correct: 0
    },
    {
        question: "What is the speed of light?",
        options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
        correct: 0
    },
    {
        question: "Which country invented paper?",
        options: ["Japan", "Korea", "China", "India"],
        correct: 2
    },
    {
        question: "What is the capital of Argentina?",
        options: ["Santiago", "Lima", "Buenos Aires", "Montevideo"],
        correct: 2
    },
    {
        question: "Who discovered gravity?",
        options: ["Galileo Galilei", "Isaac Newton", "Albert Einstein", "Johannes Kepler"],
        correct: 1
    },
    {
        question: "What is the largest bird in the world?",
        options: ["Emu", "Ostrich", "Cassowary", "Condor"],
        correct: 1
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Korea", "Japan", "Vietnam"],
        correct: 2
    },
    {
        question: "Who painted 'The Last Supper'?",
        options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Botticelli"],
        correct: 1
    },
    {
        question: "What is the capital of Spain?",
        options: ["Barcelona", "Madrid", "Valencia", "Seville"],
        correct: 1
    },
    {
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Mars", "Mercury", "Earth"],
        correct: 2
    },
    {
        question: "Who wrote 'War and Peace'?",
        options: ["Fyodor Dostoevsky", "Leo Tolstoy", "Anton Chekhov", "Ivan Turgenev"],
        correct: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
    },
    {
        question: "Which country is home to the Taj Mahal?",
        options: ["Pakistan", "Bangladesh", "Nepal", "India"],
        correct: 3
    },
    {
        question: "Who invented the light bulb?",
        options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Michael Faraday"],
        correct: 0
    },
    {
        question: "What is the capital of China?",
        options: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
        correct: 1
    },
    {
        question: "Which is the smallest continent?",
        options: ["Europe", "Antarctica", "Australia", "South America"],
        correct: 2
    },
    {
        question: "Who composed the 'Moonlight Sonata'?",
        options: ["Mozart", "Bach", "Beethoven", "Chopin"],
        correct: 2
    },
    {
        question: "What is the deepest point on Earth?",
        options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Tonga Trench"],
        correct: 0
    },
    {
        question: "Which country invented chess?",
        options: ["Russia", "China", "India", "Persia"],
        correct: 2
    },
    {
        question: "What is the capital of Russia?",
        options: ["St. Petersburg", "Moscow", "Kiev", "Minsk"],
        correct: 1
    },
    {
        question: "Who discovered America?",
        options: ["Vasco da Gama", "Christopher Columbus", "Marco Polo", "Ferdinand Magellan"],
        correct: 1
    },
    {
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Leopard", "Tiger"],
        correct: 1
    },
    // Continue with more questions...
    {
        question: "Which is the most spoken language in the world?",
        options: ["English", "Spanish", "Mandarin", "Hindi"],
        correct: 2
    },
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
        correct: 3
    },
    {
        question: "Who wrote 'The Great Gatsby'?",
        options: ["F. Scott Fitzgerald", "Ernest Hemingway", "John Steinbeck", "William Faulkner"],
        correct: 0
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correct: 2
    },
    {
        question: "Which planet is known as the Morning Star?",
        options: ["Mars", "Venus", "Mercury", "Jupiter"],
        correct: 1
    },
    {
        question: "Who painted 'The Scream'?",
        options: ["Vincent van Gogh", "Edvard Munch", "Pablo Picasso", "Claude Monet"],
        correct: 1
    },
    {
        question: "What is the capital of Japan?",
        options: ["Osaka", "Kyoto", "Tokyo", "Yokohama"],
        correct: 2
    },
    {
        question: "Which is the largest species of shark?",
        options: ["Great White Shark", "Whale Shark", "Tiger Shark", "Hammerhead Shark"],
        correct: 1
    },
    {
        question: "Who invented the World Wide Web?",
        options: ["Tim Berners-Lee", "Steve Jobs", "Bill Gates", "Mark Zuckerberg"],
        correct: 0
    },
    {
        question: "What is the capital of Italy?",
        options: ["Venice", "Milan", "Rome", "Florence"],
        correct: 2
    },
    {
        question: "Which is the longest wall in the world?",
        options: ["Hadrian's Wall", "Great Wall of China", "Berlin Wall", "Western Wall"],
        correct: 1
    },
    {
        question: "Who wrote 'Don Quixote'?",
        options: ["Miguel de Cervantes", "Gabriel García Márquez", "Jorge Luis Borges", "Pablo Neruda"],
        correct: 0
    },
    {
        question: "What is the largest cat species?",
        options: ["Lion", "Tiger", "Leopard", "Jaguar"],
        correct: 1
    },
    {
        question: "Which country is known as the Land of Fire and Ice?",
        options: ["Norway", "Finland", "Iceland", "Greenland"],
        correct: 2
    },
    {
        question: "Who discovered electricity?",
        options: ["Benjamin Franklin", "Thomas Edison", "Nikola Tesla", "Michael Faraday"],
        correct: 0
    },
    {
        question: "What is the capital of Mexico?",
        options: ["Guadalajara", "Mexico City", "Monterrey", "Cancún"],
        correct: 1
    },
    {
        question: "Which is the highest waterfall in the world?",
        options: ["Niagara Falls", "Victoria Falls", "Angel Falls", "Iguazu Falls"],
        correct: 2
    },
    {
        question: "Who wrote 'The Origin of Species'?",
        options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Alexander Fleming"],
        correct: 0
    },
    {
        question: "What is the largest snake in the world?",
        options: ["Python", "Anaconda", "Boa Constrictor", "King Cobra"],
        correct: 1
    },
    {
        question: "Which country is known as the Land of the Midnight Sun?",
        options: ["Sweden", "Norway", "Finland", "Denmark"],
        correct: 1
    },
    {
        question: "Who invented the steam engine?",
        options: ["James Watt", "Thomas Edison", "Alexander Graham Bell", "George Stephenson"],
        correct: 0
    },
    {
        question: "What is the capital of Germany?",
        options: ["Munich", "Hamburg", "Berlin", "Frankfurt"],
        correct: 2
    },
    {
        question: "Which is the largest flower in the world?",
        options: ["Sunflower", "Rafflesia", "Water Lily", "Corpse Flower"],
        correct: 1
    },
    {
        question: "Who wrote 'The Canterbury Tales'?",
        options: ["Geoffrey Chaucer", "William Shakespeare", "John Milton", "Christopher Marlowe"],
        correct: 0
    },
    {
        question: "What is the fastest flying bird?",
        options: ["Eagle", "Falcon", "Swift", "Hummingbird"],
        correct: 1
    },
    {
        question: "Which country is known as the Pearl of Africa?",
        options: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
        correct: 2
    },
    {
        question: "Who invented the radio?",
        options: ["Guglielmo Marconi", "Thomas Edison", "Nikola Tesla", "Alexander Graham Bell"],
        correct: 0
    },
    {
        question: "What is the capital of India?",
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        correct: 1
    },
    {
        question: "Which is the largest butterfly in the world?",
        options: ["Monarch", "Queen Alexandra's Birdwing", "Blue Morpho", "Atlas Moth"],
        correct: 1
    },
    {
        question: "Who wrote 'Pride and Prejudice'?",
        options: ["Jane Austen", "Emily Brontë", "Charlotte Brontë", "Virginia Woolf"],
        correct: 0
    },
    {
        question: "What is the largest bear species?",
        options: ["Grizzly Bear", "Polar Bear", "Black Bear", "Brown Bear"],
        correct: 1
    },
    {
        question: "Which country is known as the Land of Smiles?",
        options: ["Vietnam", "Cambodia", "Thailand", "Laos"],
        correct: 2
    },
    {
        question: "Who invented television?",
        options: ["John Logie Baird", "Thomas Edison", "Alexander Graham Bell", "Nikola Tesla"],
        correct: 0
    },
    {
        question: "What is the capital of South Africa?",
        options: ["Cape Town", "Pretoria", "Johannesburg", "Durban"],
        correct: 1
    },
    {
        question: "Which is the largest tree species?",
        options: ["Redwood", "Sequoia", "Giant Sequoia", "Coast Redwood"],
        correct: 2
    },
    {
        question: "Who wrote 'The Iliad'?",
        options: ["Homer", "Virgil", "Ovid", "Sophocles"],
        correct: 0
    },
    {
        question: "What is the largest species of penguin?",
        options: ["King Penguin", "Emperor Penguin", "Gentoo Penguin", "Adelie Penguin"],
        correct: 1
    },
    {
        question: "Which country is known as the Land of Lakes?",
        options: ["Sweden", "Norway", "Finland", "Canada"],
        correct: 2
    },
    {
        question: "Who invented the computer?",
        options: ["Alan Turing", "Charles Babbage", "John von Neumann", "Bill Gates"],
        correct: 1
    },
    {
        question: "What is the capital of Turkey?",
        options: ["Istanbul", "Ankara", "Izmir", "Bursa"],
        correct: 1
    },
    {
        question: "Which is the largest species of deer?",
        options: ["Red Deer", "Moose", "Elk", "Reindeer"],
        correct: 1
    }
];

module.exports = { allQuestions, specialQuestion };

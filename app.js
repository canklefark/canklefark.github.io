// Code for modal display from:
// https://www.youtube.com/watch?v=QghhoJBdw7A&t=311s

document.querySelectorAll('.card img').forEach(image => {
    image.onclick = () => {
        document.querySelector('.modal').style.display = 'block';
        document.querySelector('.modal img').src = image.getAttribute('src');
    }
});

document.querySelector('.modal span').onclick = () => {
    document.querySelector('.modal').style.display = 'none';
}  
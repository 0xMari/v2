const stickySections = [...document.querySelectorAll('.sticky')];

let images = [
    'https://images.unsplash.com/photo-1648457257285-cfbc3781cc54?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1670165805131-2365a78978a6?q=80&w=2454&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1639738415512-1f122497ef9c?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1664439520308-999f63a17f4f?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
] ;

images.forEach(img => {
    stickySections.forEach(section => {
        let image = document.createElement('img');
        image.src= img;
        section.querySelector('.scroll_section').appendChild(image);
    })
})

window.addEventListener('scroll', (e)=>{
    for(let i=0; i < stickySections.length; i++){
        transform(stickySections[i]);
    }
});

function transform(section){
    const offsetTop = section.parentElement.offsetTop;
    const scrollSection = section.querySelector('.scroll_section');
    let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
    percentage = percentage < 0 ? 0 : percentage > 400 ? 400 : percentage ;
    scrollSection.style.transform = `translate3d(${-percentage}vw, 0, 0)`;
}
let i = 50; // our starting style
let back = false;

function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration * 1000)
    })
}


setInterval(() => {
    let r = document.querySelector(':root');
    let animation = $(':root')

    // slowly increase the value from 50 to> 200) back = true;
    if (i <= 30) {
        back = false;
        sleep(2).then(r => {
        })
    }

    if (i >= 130) {
        back = true;
    }

    if (back) i = i - 1; else i = i + 1;

    if (animation[0].scrollTop === (animation[0].scrollHeight - animation[0].clientHeight)){
        return false;
    } else {
        r.style.setProperty('--bg-grid', `${i}px ${i}px`);
    }
}, 25);





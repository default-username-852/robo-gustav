const $ = require('jquery');
const ipc = require('electron').ipcRenderer;

let sounds;

ipc.invoke('filenames').then(result => {
    const tableTidth = 5; //TODO: calculate dynamically
    let table = $("#t");
    table.empty();
    for (let i = 0; i < result.length; i += tableTidth) {
        let chunk = result.slice(i, i + tableTidth);

        let toBuild = "<tr>";
        for (let filename of chunk) {
            toBuild += `<td class="click"><audio src="resources/audio/${filename}" preload="auto"></audio>${filename.slice(0, -4)}</td>`;
        }
        toBuild += "</tr>";
        table.append($(toBuild));
    }

    sounds = result;

    $(".click").on("click", event => {
        $(event.currentTarget).children("audio")[0].play();
    });
});

let auto = {
    enabled: false,
    delay: 1000,
    timerId: undefined,
};

$(document).ready(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        $("#deviceSelector")
            .empty()
            .append($(devices
                .filter(device => device.kind === 'audiooutput')
                .map(e => `<option value="${e.deviceId}">${e.label}</option>`)
                .reduce((acc, e) => acc + e, "")))
            .on("change", event => {
                $(".click>audio").each((i, e) => {
                    e.setSinkId(event.currentTarget.value);
                });
            });
    });

    $("#volume").on("input", event => {
        let v = parseInt(event.currentTarget.value);
        $("#volumeDisplay").text(`Volume: ${v}`);
        $(".click>audio").each((i, e) => {
            e.volume = v / 100;
        });
    });

    $("#auto").on("click", event => {
        if (auto.enabled) {
            $(event.currentTarget).css("background-color", "");
            clearInterval(auto.timerId);
            auto.enabled = false;
        } else {
            $(event.currentTarget).css("background-color", "#28dd1f");
            auto.delay = parseInt($("#delay").val()) * 1000;
            auto.timerId = setInterval(playRandomSound, auto.delay);
            auto.enabled = true;
        }
    });
});

function playRandomSound() {
    $(`audio[src="resources/audio/${sounds[Math.floor(Math.random() * sounds.length)]}"]`)[0].play();
}
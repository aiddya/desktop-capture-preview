/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const both_btn = document.getElementById("both-btn")
both_btn.addEventListener('click', async () => {
  displaySources(await window.electron.listAll())
})

const screens_btn = document.getElementById("screens-btn")
screens_btn.addEventListener('click', async () => {
  displaySources(await window.electron.listScreens())
})

const windows_btn = document.getElementById("windows-btn")
windows_btn.addEventListener('click', async () => {
  displaySources(await window.electron.listWindows())
})

async function displaySources(desktop_sources) {
  const sources_element = document.getElementById("sources")
  sources_element.replaceChildren()

  for (i = 0; i < desktop_sources.length; i++) {
    const source_div = document.createElement("div")
    const source_thumb = document.createElement("img")
    source_thumb.src = desktop_sources[i].image
    source_div.appendChild(source_thumb)

    const source_btn = document.createElement("button")
    const source_id = desktop_sources[i].id
    source_btn.innerHTML = source_id
    source_btn.addEventListener('click', () => startDisplayMedia(source_id))
    source_div.appendChild(source_btn)

    sources_element.appendChild(source_div)
  }
}

async function startDisplayMedia(source_id) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source_id,
        }
      }
    })
    handleStream(stream)
    setupStopStream(stream)
  } catch (e) {
    handleError(e)
  }
}


function setupStopStream(stream) {
  const both_btn = document.getElementById("stop-stream")
  both_btn.addEventListener('click', async () => {
    stream.getTracks().forEach(track => track.stop())
  })
}

function handleStream(stream) {
  const video = document.querySelector('video')
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

function handleError(e) {
  console.log(e)
}

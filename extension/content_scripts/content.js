const BUTTON_CLASS = "nope-btn";
const POST_CHECKED_ATTRIBUTE = `data-${Date.now()}`;
const NOPE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1q142lx"><g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path></g></svg>`;

const observer = new MutationObserver(appendNopeButton);
observer.observe(document.body, { subtree: true, childList: true });

document.addEventListener("click", handleButtonClick, true);

function appendNopeButton() {
  const posts = document.getElementsByTagName("article");

  const forYouTabActive = !!document.querySelector(
    'div[data-testid="ScrollSnap-List"] > div:first-child a[href="/home"][aria-selected="true"]'
  );

  if (!forYouTabActive) return;

  Array.from(posts).forEach((post) => {
    if (!post.hasAttribute(POST_CHECKED_ATTRIBUTE)) {
      addNopeButton(post);
      post.setAttribute(POST_CHECKED_ATTRIBUTE, true);
    }
  });
}

function handleButtonClick(event) {
  const clickedButton = event.target.closest("button");

  if (!clickedButton || !clickedButton.classList.contains(BUTTON_CLASS)) return;

  const card = clickedButton.closest("article");
  const menuButton = card.querySelector('button[data-testid="caret"]');

  if (menuButton) {
    menuButton.click();
    clickNotInterested();
  }
}

function clickNotInterested() {
  // need to wait until menu is open
  setTimeout(() => {
    const menu = document.querySelector('div[data-testid="Dropdown"]');
    if (menu && menu.firstChild) {
      menu.firstChild.click();
    }
  }, 0);
}

function addNopeButton(article) {
  const likeButton = article.querySelector('button[data-testid="like"]');
  if (!likeButton) return;

  const buttonContainer = likeButton.parentNode;
  const clonedButton = cloneButton(likeButton);

  buttonContainer.after(createButtonContainer(clonedButton));
}

// Clone the "like" button and modify it for "Nope"
function cloneButton(button) {
  const clonedButton = button.cloneNode(true);

  clonedButton.classList.add(BUTTON_CLASS);
  clonedButton.removeAttribute("data-testid");
  clonedButton.setAttribute("aria-label", "Not interested in this post");
  clonedButton.firstChild.innerHTML = NOPE_ICON;

  return clonedButton;
}

// Create a new button container and insert the cloned button
function createButtonContainer(button) {
  const containerClone = document.createElement("div");

  containerClone.style.flex = "0.75";
  containerClone.appendChild(button);

  return containerClone;
}

<script lang="ts">
  import { Wave } from "svelte-loading-spinners";
  import { ethers } from "ethers";
  import MoodContractABI from "../../artifacts/contracts/MoodContract.sol/MoodContract.json";

  // contract address depending on local or rinkeby
  //   const moodContractAddress = "0x04C89607413713Ec9775E14b954286519d836FEf"; // local
  const moodContractAddress = "0x7Ce815B4FC1E7BCECF9104e023B4632B23997876"; // rinkeby

  // the variables that will be needed by the template
  let currentAccount;

  let allMoods = new Array();
  const pollOptions = ["wagmi", "gm", "ngmi"];
  let status = "idle";

  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        currentAccount = accounts[0];
        console.log("Found an authorized account:", currentAccount);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      currentAccount = accounts[0];
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  window.ethereum.on("accountsChanged", function (accounts) {
    window.location.reload();
  });

  // request access to the user's MetaMask account
  //   async function requestAccount() {
  // await window.ethereum.request({ method: "eth_requestAccounts" });
  //   }

  //   window.ethereum?.on("accountsChanged", handleAccountsChanged);
  //   window.ethereum?.on("chainChanged", () => window.location.reload());

  //   let currentAccount;
  //   ethereum
  //     ?.request({ method: "eth_accounts" })
  //     .then(handleAccountsChanged)
  //     .catch((err) => console.error(err));

  //   function handleAccountsChanged(accounts) {
  //     if (accounts.length === 0) {
  //       console.log("Please connect to MetaMask");
  //     } else if (accounts[0] !== currentAccount) {
  //       currentAccount = accounts[0];
  //     }
  //   }

  // get the mood contract
  function getMoodContract() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const moodContract = new ethers.Contract(
        moodContractAddress,
        MoodContractABI.abi,
        signer
      );

      return moodContract;
    }
  }

  async function getAllMoods() {
    // await requestAccount();
    const _allMoods = await getMoodContract().getAllMoods();

    if (_allMoods.length === 0) {
      console.log("No moods yet");
    } else {
      const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      Object.keys(_allMoods).forEach((key) => {
        const _postedAtUnix = new Date(_allMoods[key]["postedAt"] * 1000);

        const year = _postedAtUnix.getFullYear();
        const month = monthsArray[_postedAtUnix.getMonth()];
        const date = _postedAtUnix.getDate();
        const hours = _postedAtUnix.getHours();
        const minutes = "0" + _postedAtUnix.getMinutes();
        // const seconds = "0"+_postedAtUnix.getSeconds();

        const _postedAt =
          "" +
          (date <= 9 ? "0" + date : date) +
          " " +
          month +
          " " +
          year +
          ", at " +
          hours +
          ":" +
          minutes.substr(-2);

        allMoods[key] = {
          address: _allMoods[key]["responder"],
          mood: _allMoods[key]["mood"],
          postedAt: _postedAt,
        };
      });
    }
  }

  function optionSelected(event) {
    if (!currentAccount) {
      alert("Please connect Metamask wallet first");
      return;
    }

    setMood(event.target.value);
  }

  async function setMood(selectedOption) {
    if (currentAccount) {
      try {
        const moodContract = getMoodContract();

        let moodTxn = await moodContract.setMood(selectedOption, {
          gasLimit: 300000,
        });
        console.log("Mining...", moodTxn.hash);

        status = "proccessing";

        await moodTxn.wait();
        console.log("Mined...", moodTxn.hash);

        status = "done";
        getAllMoods();
      } catch (error) {
        if (error.message.indexOf("Wait") !== -1) {
          alert("please wait 30 seconds before attempting again...");
        }
      }
    }
  }

  checkIfWalletIsConnected();
  getAllMoods();
</script>

<div class="connect-wrapper">
  {#if !currentAccount}
    <button class="connect" on:click={connectWallet}>Connect Wallet</button>
  {:else}
    <div class="message">
      Your wallet is connected (address: {currentAccount})
    </div>
  {/if}
</div>

<div class="poll-container">
  <h1 class="title">So, how are we feeling today?</h1>
  <h3 class="sub-title">[Running on Rinkeby Testnet]</h3>

  <div class="poll">
    <div class="options">
      {#each pollOptions as pollOption}
        <label>
          <input
            type="radio"
            group="poll"
            name="pollOption"
            value={pollOption}
            on:change={optionSelected}
          />
          <img
            class="smiley"
            src={"/assets/images/" + pollOption + ".png"}
            alt=""
          />{pollOption}
        </label>
      {/each}
    </div>
  </div>

  <div id="spinner" class={status}>
    <div class="wave-wrapper">
      <span class="text">mining...</span>
      <Wave size="40" color="#6970d6" unit="px" />
    </div>
    <div class="confirmation">
      Thank you. Your feelings are now on the chain.
    </div>
  </div>

  <div class="history">
    <h2 class="title">How others are feeling...</h2>
    <div class="items">
      {#each allMoods as mood, i}
        <div class="row">
          <span class="cell mood">{mood.mood}</span>
          <span class="cell postedAt"
            ><span class="dim">posted on</span> {mood.postedAt}</span
          >
          <span class="cell address"
            ><span class="dim">by</span> {mood.address}</span
          >
        </div>
      {:else}
        <div class="empty">
          Connect to Rinkeby test network to see other responses.
        </div>
      {/each}
    </div>
  </div>
</div>

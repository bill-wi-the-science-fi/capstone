import React from 'react'
import {Jumbotron, Container, Image} from 'react-bootstrap'

import {connect} from 'react-redux'

export const Intro = () => {
  return (
    <div className="container-fluid pr-0 pl-0">
      <Jumbotron fluid>
        <Container>
          <h1>...Tell me more...</h1>
          <p>
            This is where we'll get you up to speed on everything you need to
            get started.
          </p>
        </Container>
      </Jumbotron>

      <div className="container pr-0 pl-0">
        <div className="row flex-wrap-reverse no-gutters">
          <div className="col-md-8">
            <h2>
              I've been nominated, and I have to get an app called MetaMask,
              what is that?
            </h2>
            <p>
              This site is part of our decentralized Application (or "Dapp")
              which interfaces with the Ethereum Network. MetaMask is a browser
              plugin that serves as your wallet so you can donate, receive
              funds, or interact with other Dapps.
            </p>
            <p>
              For a more detailed explaination,
              <a href="https://decrypt.co/resources/metamask">
                {` check out this article.`}
              </a>
            </p>
            <p>
              To install MetaMask,
              <a href="https://metamask.io/download.html">
                {` check out their website.`}
              </a>
            </p>
          </div>
          <div className="col-md-3 flex">
            <Image
              className="about-img mt-5"
              src="https://blogs.airdropalert.com/wp-content/uploads/2018/10/metamask_featured.jpg"
            />
          </div>
        </div>
      </div>
      <div className="container pr-0 pl-0">
        <div className="row mt-5 mb-5 flex-wrap no-gutters">
          <div className="col-md-3 flex">
            <Image
              className="about-img mt-5"
              src="https://www.uktech.news/wp-content/uploads/2019/09/shutterstock_776426233-898x505.jpg"
            />
          </div>
          <div className="col-md-8">
            <h2>
              Woah there, I know Bitcoin, but what is the "Ethereum Network?"
            </h2>
            <p>
              Ethereum is the name of the network, you can think of this as a
              "world computer". “Ether” is the native cryptocurrency token used
              by the Ethereum network. That said, in day-to-day usage most
              people call the token “ETH," hence our name. ETH works much like
              Bitcoin. But it also has a special role on Ethereum network.
              Because users pay fees in ETH to execute smart contracts, you can
              think of it as the fuel that keeps the whole thing running (which
              is why those fees are called “gas”).
            </p>
            <p>
              For a more detailed explaination,
              <a href="https://www.coinbase.com/learn/crypto-basics/what-is-ethereum">
                {` check out this article.`}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="container pr-0 pl-0">
        <div className="row flex-wrap-reverse no-gutters">
          <div className="col-md-8">
            <h2>Really, do I have to ask about Smart Contracts too?</h2>
            <p>Sorry! Smart contracts 101!</p>
            <p>
              The Ethereum network basically allows you to program a smart
              contract that is executed on the internet. A smart contract has
              been compared to a digital vending machine. If you put a dollar
              into the machine and select a soda, the machine is hardwired to
              either produce your drink and 75 cents in change, or (if your
              choice is sold out) to prompt you to make another selection or get
              your dollar back.
            </p>

            <p>
              Our site simply is another smart contract on the network, keeping
              track of awards, donations and is programmed to automatically
              handle all of the transactions, using ETH as the currency. Pretty
              cool! Huh?
            </p>
          </div>
          <div className="col-md-3 flex">
            <Image
              className="about-img mt-5"
              src="https://youteam.io/blog/wp-content/uploads/2018/04/image-e1523955910900.png"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {}
}

const mapDispatch = (dispatch) => {
  return {}
}

export default connect(mapState, mapDispatch)(Intro)

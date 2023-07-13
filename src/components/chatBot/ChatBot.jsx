import { Helmet } from 'react-helmet'
import './chatBotStyle.scss'

const ChatBot = () => {
  return (
    <div className="chat-bot">
      <Helmet>
        <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
      </Helmet>
      <df-messenger
        className="message"
        // chat-icon="https:&#x2F;&#x2F;cdn0.iconfinder.com&#x2F;data&#x2F;icons&#x2F;product-avatar&#x2F;512&#x2F;Robot_Avatars_1-512.png"
        intent="WELCOME"
        chat-title="H2Store Virtual Assistant"
        agent-id="29caa562-6af4-4b1d-a022-31c25cce08e6"
        language-code="vi"
        wait-open="true"
      ></df-messenger>
    </div>
  )
}
export default ChatBot

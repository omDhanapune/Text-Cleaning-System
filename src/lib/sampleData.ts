export const SAMPLE_TEXTS = {
  dirtyCustomerReview: `<div class="review-box">
  <p>Customer said the login page is not opening properly...   please check check the issue!!! Visit https://support.example.com/login for details. 😊😊</p>
  <span>Ref: TXN-88291</span> Payment was deducted but the transaction is showing <b>FAILED</b> failed. 😕
</div>`,

  socialMediaPost: `Just dropped our new LLM model update! 🚀🤖🔥 
Check the benchmark dataset at https://huggingface.co/datasets/nlp-eval?v=2.4#results! 
This is is the the most exciting release @@##$$%%!! 
Natural language processing    requires    clean    high-quality   data. 
Don't miss out, visit www.ai-open-source.org or email team@ai-bench.io now! 🎉🎉`,

  htmlScrape: `<article class="article-content">
  <header>
    <h1>Case Study 9: Intelligent Text Cleaning System</h1>
    <span class="meta">Published: 2026-09-25</span>
  </header>
  <div class="body">
    <p>Machine Learning pipelines require <strong>pure, normalized text</strong>.</p>
    <ul>
      <li>Remove malicious &lt;script&gt;alert('test')&lt;/script&gt; tags.</li>
      <li>Strip redundant tracking URLs like https://analytics.site.com/track?id=99283#top</li>
      <li>Filter duplicate duplicate tokens automatically!</li>
    </ul>
  </div>
</article>`,

  duplicateTokens: `The order status shows DELIVERED delivered but the customer says the package was NOT received received received.
Please verify verify the account details at https://portal.example.com/verify.
The system generated duplicate duplicate notifications after the server restart restart.
Contact support support for further inquiries!!!`,

  fullBenchmarkCorpus: `RECORD_ID: RT0001
CATEGORY: SUPPORT
RAW_TEXT: Customer said the login page is not opening properly...   please check check the issue!!! Visit https://support.example.com/login for details.

RECORD_ID: RT0002
CATEGORY: PAYMENT
RAW_TEXT: <p>User reported that the <b>password reset</b> link is expired.</p>   They requested a new link. 😊

RECORD_ID: RT0003
CATEGORY: ACCOUNT
RAW_TEXT: The order status shows DELIVERED delivered but the customer says the package was NOT received.   Track: https://shop.example.com/track/7821

RECORD_ID: RT0004
CATEGORY: TECHNICAL
RAW_TEXT: The application crashes when I click the 'Submit' button. <br> Please investigate @support #bug #urgent !!!

RECORD_ID: RT0005
CATEGORY: FEEDBACK
RAW_TEXT: Payment was deducted but the transaction is showing <span>FAILED</span> failed.   Ref: TXN-88291. 😕

RECORD_ID: RT0006
CATEGORY: GENERAL
RAW_TEXT: The dashboard contains extra      spaces and weird symbols ### %% @@ that should be removed. http://status.example.com`,
};

export const SAMPLE_CSV_DATA = `id,customer_name,category,raw_text,priority
101,John Doe,SUPPORT,"Customer said the login page is not opening properly...   please check check the issue!!! Visit https://support.example.com/login",HIGH
102,Jane Smith,PAYMENT,"<p>User reported that the <b>password reset</b> link is expired.</p>   They requested a new link. 😊",MEDIUM
103,Alex Rivera,ORDER,"The order status shows DELIVERED delivered but the customer says the package was NOT received.   Track: https://shop.example.com/track/7821",HIGH
104,Maria Garcia,TECHNICAL,"The application crashes when I click the 'Submit' button. <br> Please investigate @support #bug #urgent !!!",CRITICAL
105,David Lee,FEEDBACK,"Payment was deducted but the transaction is showing <span>FAILED</span> failed.   Ref: TXN-88291. 😕",HIGH
106,Emma Wilson,GENERAL,"The dashboard contains extra      spaces and weird symbols ### %% @@ that should be removed.",LOW
107,Michael Brown,SUPPORT,"User copied this text from a webpage: <div><h3>Service unavailable</h3><p>Try again later.</p></div> http://status.example.com",MEDIUM
108,Sophia Chen,ACCOUNT,"The customer asked about refund policy. Refund refund has not appeared in the account yet. #refund #payment 💳",HIGH`;

# Soundchain - blockchain powered music streaming
Soundchain is a music streaming platform that uses blockchain technology to provide a fair trade music listening experience. In order to pay the creators of music, instead of showing you ads, we borrow your device's CPU to mine cryptocurrency. The cryptocurrency you generate is then sent to the artist that you listened to. It's that simple. In this way, you have a un interrupted music experience and the artists get paid directly. Now, if you don't want to lend your cpu that's all right. Soundchain works on a prepaid fashion as well. Load any amount of money into your account and pay the artists as you go, no subscriptions, no chains

**Link to project:** http://franciscorafart.com/links/soundchain/about.html

## How It's Made:

**Tech used:**  JavaScript, Firebase, FirebaseUI, CoinHive, HTML, CSS

The app uses CoinHive tools to run a script that mines cryptocurrency as the user listens to music. Firebase is used to store the music files (mp3), to keep track of the currency generated by the users computer, how long and what music they listened to, and to store references of track ownership. FirebaseUI is used to manage authentication.

## Optimizations
*(optional)*
In the future I will implement a payment system for users that don't want to lend their CPU to mine cryptocurrency. This users will be able to 'pay as they go'.

I will also build a custom API to keep keys hidden from the client side device. Even though Firebase has security measures that limit the possibility of using this information malociously.

## Lessons Learned:

With this project I learned how to use Firebase extensively, including Authentication, Database and Storage. I also learn't a about how blockchain technology works and best practices in database storage.

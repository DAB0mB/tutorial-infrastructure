In this step we will authenticate and identify users in our app.

Before we go ahead and start extending our app, we will add a few packages which will make our lives a bit less complex when it comes to authentication and users management.

Firt we will update our Meteor server and add few Meteor packages called `accounts-base` and `accounts-phone` which will give us the ability to verify a user using an SMS code:

    $ meteor add accounts-base
    $ meteor add okland:accounts-phone

And second, we will update the client, and add the corresponding authentication packages to it as well:

    $ npm install accounts-base-client-side --save
    $ npm install accounts-phone --save

We will also need to install their decleration files so Typescript know how to handle them:

    $ typings install dt~meteor-accounts-phone --save --global

Let's import these packages in the app's main component so they can be a part of our bundle:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.4"></diffbox>

For the sake of debugging we gonna write an authentication settings file which might make our life easier, but once your'e in production mode you *shouldn't* use this configuration:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.5"></diffbox>

Now anytime we run our app we should provide it with a `settings.json`:

    $ meteor run --settings settings.json

> *NOTE*: If you would like to test the verification with a real phone number, `accouts-phone` provides an easy access for [twilio's API](https://www.twilio.com/), for more information see [accounts-phone's repo](https://github.com/okland/accounts-phone).

We will now apply the settings file we've just created so it can actually take effect:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.6"></diffbox>

For authentication we gonna create the following flow in our app:

- login - The initial page. Ask for the user's phone number.
- verification - Verify a user's phone number by an SMS authentication.
- profile - Ask a user to pickup its name. Afterwards he will be promoted to the tabs page.

Before we implement these page, we need to identify if a user is currently logged in. If so, he will be automatically promoted to the chats view, if not, he is gonna be promoted to the login view and enter a phone number.

Let's apply this feature to our app's main component:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.7"></diffbox>

Cool, now that we're set, let's start implementing the views we mentioned earlier. We will start with the login page.

In this page we will request an SMS verification right after a phone number has been entered:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.8"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.9"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.10"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.11"></diffbox>

This is how the login view should look like:

Android:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-4-md.png)

iOS:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-4-ios.png)

Up next, would be the verification view.

In this page we will be verifying the SMS code and in case of successful authentication we will transition to the profile view.

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.12"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.13"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.14"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.15"></diffbox>

This is how the verification view should look like:

Android:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-5-md.png)

iOS:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-8-ios.png)

The last stage in the authentication flow would be profiling.

The profile view provides the ability to enter the user's nickname and profile picture.

Since the profile view is responsible for updating the profile we need to implement its corresponding Meteor method:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.16"></diffbox>

We also need to add a decleration for the profile model:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.17"></diffbox>

And here's the component:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.18"></diffbox>

Notice how we referenced an icon provided to us by `Ionic` as the default profile picture. We need this path to be available to us. Everyting that is placed under the `www` dir will be served as is, therefore we can just add a symbolic link which will make all the icons available to be served as public assets:

    $ cd www
    $ ln -s ../node_modules/ionicons/dist ionicons

Now let's implement the template:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.20"></diffbox>

And the stylesheet:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.21"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.22"></diffbox>

This is how the profile view should look like:

Android:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-6-md.png)

iOS:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-6-ios.png)

Our authentication flow is complete! However there are some few adjustments we need to make before we proceed to the next step.

For the messaging system, each message should have an owner. If a user is logged-in a message document should be inserted with an additional `senderId` field:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.23"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.24"></diffbox>

And in the messages component instead of determining whenever the message is mine or not by it's parity, we can do that whenever the sender id is the same as the id of the current user logged in:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.25"></diffbox>

Now we wanna add the abilities to log-out and edit our profile as well, which are gonna be presented to us using a popover. Let's show a popover any time we press on the options icon in the top right corner of the chats view:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.26"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.27"></diffbox>

Now let's implement the component for the chats options which will handle the profile editing and logging-out:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.28"></diffbox>

Let's implement the view:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.29"></diffbox>

And the stylesheet as well:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.30"></diffbox>

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.31"></diffbox>

As for now, once you click on the options icon in the chats view, the popover should appear in the middle of the screen. To fix it, we simply gonna edit the `scss` file of the chats page:

<diffbox tutorial="whatsapp2-ionic-tutorial" step="5.32"></diffbox>

This should be the final result of the popover:

Android:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-7-md.png)

iOS:

![angular2-wa-ionic-cli](/assets/tutorials/angular2-whatsapp-ionic-cli/screenshot-7-ios.png)
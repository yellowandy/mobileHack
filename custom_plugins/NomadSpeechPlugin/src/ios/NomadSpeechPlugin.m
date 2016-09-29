#import "NomadSpeechPlugin.h"


@implementation NomadSpeechPlugin

- (void)pluginInitialize {
    [self createFloatingView];
}

- (void)enableAssistant:(CDVInvokedUrlCommand*)command
{
    [self createFloatingView];
//    UIView* parentView = self.viewController.view;
//    parentView.userInteractionEnabled = NO;  // disable user interaction while splashscreen is shown
//    UIStoryboard *sb = [UIStoryboard storyboardWithName:kLaunchScreenStoryboardName bundle:nil];
//    UIViewController *_vc = [sb instantiateViewControllerWithIdentifier:kLaunchScreenViewControllerId];
//    _splashView = _vc.view;
//    _splashView.frame = CGRectMake(parentView.frame.origin.x, parentView.frame.origin.y, parentView.frame.size.width, parentView.frame.size.height);
//    [parentView addSubview:_splashView];
//    parentView.autoresizesSubviews = YES;
}

- (void) createFloatingView
{
    UIView* parentView = self.viewController.view;

    float X_Co = parentView.frame.size.width - 50.0f;
    float Y_Co = parentView.frame.size.height - 50.0f;
    
    // Create the rectangle to define the button
    CGRect footerRect = CGRectMake(X_Co, Y_Co, 40.0f, 40.0f);

    // Create view to hold the button
    UIView* voiceView = [[UIView alloc] initWithFrame:footerRect];

    // Set the background color to be transparent (or whatever you want it to be)
    voiceView.backgroundColor = [UIColor clearColor];

    // Create a button. You can change the type according to your needs.
    UIButton* voiceButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];

    // Extract the button's frame and change the location of the button
    CGRect buttonFrame = voiceButton.frame;
    buttonFrame.origin.x = 0;
    buttonFrame.origin.y = 0;
    buttonFrame.size.width = 40.0f;
    buttonFrame.size.height = 40.0f;
    voiceButton.frame = buttonFrame;

    // Set various properties of the button
    UIImageView *voiceImageView = [[UIImageView alloc]initWithImage:[UIImage imageNamed:@"SpeechPluginResources/mic.png"]];
    voiceImageView.frame = CGRectMake(0, 0, 40.0f, 40.0f);//choose values that fit properly inside the frame of your baseButton
    //or grab the width and height of yourBaseButton and change accordingly
    voiceImageView.contentMode=UIViewContentModeScaleAspectFill;//or whichever mode works best for you
    [voiceButton addSubview:voiceImageView];

    // The function to be called when the button is tapped. In this case, "voiceButtonTapped" will be called
    [voiceButton addTarget:self action:@selector(voiceButtonTapped:) forControlEvents:UIControlEventTouchUpInside];

    // Add the button to the view created earlier
    [voiceView addSubview:voiceButton];

    // Add the view to the master view
    [parentView addSubview:voiceView];
    [parentView bringSubviewToFront:voiceView];
}

- (void)voiceButtonTapped:(UIButton*)sender{
    
}

@end

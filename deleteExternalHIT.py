from boto.mturk.connection import MTurkConnection
from boto.mturk.question import ExternalQuestion

import sys

######  CONFIGURATION PARAMETRS  ######

SANDBOX = True  # Select whether to post to the sandbox (using fake money), or live MTurk site (using REAL money)

# Your Amazon Web Services Access Key (private)
AWS_ACCESS_KEY = '' # <-- TODO: Enter your access key here
# Your Amazon Web Services Secret Key (private)
AWS_SECRET_KEY = '' # <-- TODO: Enter your private key here

#######################################


""" Delete the HIT associated with the supplied HITId. """
def delete_hit(hit_id):
	if SANDBOX:
		mturk_url = 'mechanicalturk.sandbox.amazonaws.com'
		preview_url = 'https://workersandbox.mturk.com/mturk/preview?groupId='
	else:
		mturk_url = 'mechanicalturk.amazonaws.com'
		preview_url = 'https://mturk.com/mturk/preview?groupId='

	conn = MTurkConnection(aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, host=mturk_url)

	conn.expire_hit(hit_id)

	# Give the HIT a moment to expire.
	time.sleep(0.25)
	conn.dispose_hit(hit_id)

	print("HIT " + hit_id + " was deleted!")

if __name__ == "__main__":
	import time
	delete_hit(sys.argv[1])

use Mojo::DOM;
use Path::Tiny;
use Text::MultiMarkdown qw/markdown/;
use Getopt::Long::Descriptive;

my ($opt, $usage) = describe_options(
  $0 . ' %o <markdown-file> <html-file>',
  [ 'selector|s=s', "the css selector to insert into", { default  => '#content' } ],
  [ 'in_place|i', "edit in place" ],
  [],
  [ 'verbose|v',  "print extra stuff"            ],
  [ 'help',       "print usage message and exit", { shortcircuit => 1 } ],
);
 
print($usage->text), exit if $opt->help;

my $template = path($ARGV[1]);
my $dom = Mojo::DOM->new($template->slurp_utf8);
my $markdown = markdown(path($ARGV[0])->slurp_utf8);

die "Selector is empty" unless $dom->at($opt->selector);

$template->copy($template . '~');

$dom->at($opt->selector)->content($markdown);

$template->spew_utf8($dom);

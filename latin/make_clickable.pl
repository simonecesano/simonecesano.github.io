use Path::Tiny;

$\ = "\n"; $, = "\t";

my $latin = path($ARGV[0]);
my $template = path('~/Devel/simonecesano.github.io/latin/template.html')->slurp_utf8;

my $title = $latin->basename; for($title) { s/\.txt//; s/^\d+_//; s/_/ /g; }

print STDERR $name;

my $text = $latin->slurp_utf8;

for ($template) {
    s/## title ##/$title/g;
    s/## text ##/$text/;    
}

print $template;

$output = $latin->basename; $output =~ s/\.txt/.html/;
$output = path($output);

$output->spew_utf8($template);


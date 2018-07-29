$\ = "\n"; $, = "\t";

while (<>) {
    chomp;
    my $f = $_;
    s/\.html//;
    s/^\d+_//;
    s/_/ /g;
    my $li = sprintf('- [%s](%s)', $_, $f);
    print $li;
}

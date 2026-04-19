/**
 * Distractors for all 128 USCIS civics questions (2025 version).
 *
 * Each key is the question number (1–128).
 * Each value is an array of plausible-but-wrong answer choices.
 * Correct answers are NEVER included here — this file is wrong-answers-only.
 *
 * Design rules:
 *  - Same semantic type as the correct answer (number ↔ number, name ↔ name, etc.)
 *  - Plausible to a student who hasn't studied
 *  - No obviously absurd choices
 */
export const DISTRACTORS: Record<number, string[]> = {
  // ── A: Principles of American Democracy ──────────────────────────────────

  1: [
    // Q: What is the form of government of the United States?
    // Correct: Republic / Constitution-based federal republic / Representative democracy
    'Parliamentary democracy',
    'Constitutional monarchy',
    'Direct democracy',
    'Federal parliamentary republic',
    'Unitary republic',
    'Socialist democracy',
    'Presidential monarchy',
    'Oligarchy',
  ],

  2: [
    // Q: What is the supreme law of the land?
    // Correct: (U.S.) Constitution
    'The Bill of Rights',
    'The Declaration of Independence',
    'The Federalist Papers',
    'The Articles of Confederation',
    'The Emancipation Proclamation',
    'The Magna Carta',
    'The Civil Rights Act',
    'The Gettysburg Address',
  ],

  3: [
    // Q: Name one thing the U.S. Constitution does.
    // Correct: Forms/defines government; protects rights of people
    'Declares independence from Britain',
    'Sets the tax rates',
    'Establishes the national religion',
    'Names the first president',
    'Creates the national currency',
    'Defines the national language',
    'Grants citizenship to all residents',
    'Sets the voting age',
  ],

  4: [
    // Q: What does "We the People" mean?
    // Correct: Self-government / Popular sovereignty / Consent of the governed
    'The government decides what is best for everyone',
    'All people are created equal',
    'The president speaks for all Americans',
    'Congress represents the majority',
    'Every individual has unalienable rights',
    'Freedom is guaranteed to all citizens',
    'The courts protect the people',
    'The military serves the nation',
  ],

  5: [
    // Q: How are changes made to the U.S. Constitution?
    // Correct: Amendments / The amendment process
    'Executive orders',
    'Presidential decrees',
    'Acts of Congress alone',
    'Supreme Court rulings',
    'Referendums',
    'Senate resolutions',
    'Constitutional conventions called by the president',
    'Popular vote by simple majority',
  ],

  6: [
    // Q: What does the Bill of Rights protect?
    // Correct: Basic rights of Americans / people living in the U.S.
    'The rights of the president',
    'The rights of Congress',
    'The powers of the Supreme Court',
    'The rights of states only',
    'The rights of soldiers',
    'The rights of property owners',
    'The rights of immigrants only',
    'The powers of the federal government',
  ],

  7: [
    // Q: How many amendments does the U.S. Constitution have?
    // Correct: 27
    '10',
    '12',
    '15',
    '21',
    '25',
    '26',
    '28',
    '30',
    '33',
  ],

  8: [
    // Q: Why is the Declaration of Independence important?
    // Correct: America free from Britain; all people created equal; inherent rights; individual freedoms
    'It created the three branches of government',
    'It established the Bill of Rights',
    'It ended the Civil War',
    'It freed the slaves',
    'It set up the federal tax system',
    'It created the U.S. military',
    'It established the Supreme Court',
    'It gave women the right to vote',
  ],

  9: [
    // Q: What founding document said the American colonies were free from Britain?
    // Correct: Declaration of Independence
    '(U.S.) Constitution',
    'The Bill of Rights',
    'The Articles of Confederation',
    'The Federalist Papers',
    'The Mayflower Compact',
    'The Emancipation Proclamation',
    'The Stamp Act',
    'The Treaty of Paris',
  ],

  10: [
    // Q: Name two important ideas from the Declaration of Independence and the U.S. Constitution.
    // Correct: Equality, Liberty, Social contract, Natural rights, Limited government, Self-government
    'Manifest destiny',
    'States\' rights',
    'Religious authority',
    'Military supremacy',
    'Economic prosperity',
    'Judicial review',
    'Federal supremacy',
    'Checks and balances',
  ],

  11: [
    // Q: The words "Life, Liberty, and the pursuit of Happiness" are in what founding document?
    // Correct: Declaration of Independence
    '(U.S.) Constitution',
    'The Bill of Rights',
    'The Gettysburg Address',
    'The Federalist Papers',
    'The Articles of Confederation',
    'The Emancipation Proclamation',
    'The Pledge of Allegiance',
    'The Preamble to the Constitution',
  ],

  12: [
    // Q: What is the economic system of the United States?
    // Correct: Capitalism / Free market economy
    'Socialism',
    'Communism',
    'Mixed economy',
    'Command economy',
    'Mercantilism',
    'Feudalism',
    'Planned economy',
    'State capitalism',
  ],

  13: [
    // Q: What is the rule of law?
    // Correct: Everyone must follow the law; leaders must obey; no one is above it
    'The president decides what the law means',
    'The Supreme Court can change any law',
    'Congress makes all final decisions',
    'The military enforces the law in emergencies',
    'Laws apply only to citizens, not to the government',
    'The majority can override the law by popular vote',
    'Judges are above the law they interpret',
    'Only elected officials are subject to the law',
  ],

  14: [
    // Q: Many documents influenced the U.S. Constitution. Name one.
    // Correct: Declaration of Independence, Articles of Confederation, Federalist Papers, etc.
    'The Emancipation Proclamation',
    'The Gettysburg Address',
    'The Monroe Doctrine',
    'The Treaty of Versailles',
    'The Magna Carta (not on official list)',
    'The Stamp Act',
    'The Bill of Rights',
    'The Northwest Ordinance',
  ],

  15: [
    // Q: There are three branches of government. Why?
    // Correct: So one part does not become too powerful; checks and balances; separation of powers
    'To make laws easier to pass',
    'Because the Constitution required three branches by tradition',
    'To give each political party a branch',
    'To make the government more efficient',
    'To separate federal and state power',
    'To represent the three original colonies',
    'To allow laws to be reviewed twice',
    'To give judges more independence from voters',
  ],

  // ── B: System of Government ──────────────────────────────────────────────

  16: [
    // Q: Name the three branches of government.
    // Correct: Legislative, executive, and judicial / Congress, president, courts
    'Federal, state, and local',
    'Senate, House, and Supreme Court',
    'Military, civilian, and judicial',
    'Presidential, congressional, and state',
    'Administrative, legislative, and military',
    'Executive, military, and civil service',
    'National, regional, and local',
    'Democratic, republican, and independent',
  ],

  17: [
    // Q: The President is in charge of which branch?
    // Correct: Executive branch
    'Legislative branch',
    'Judicial branch',
    'Administrative branch',
    'Military branch',
    'All three branches equally',
    'The Cabinet branch',
    'The regulatory branch',
    'The federal branch',
  ],

  18: [
    // Q: What part of the federal government writes laws?
    // Correct: (U.S.) Congress / Legislature / Legislative branch
    'The President',
    'The Supreme Court',
    'The Cabinet',
    'The Department of Justice',
    'The Executive branch',
    'The Judicial branch',
    'The Electoral College',
    'The Federal Reserve',
  ],

  19: [
    // Q: What are the two parts of the U.S. Congress?
    // Correct: Senate and House of Representatives
    'The House and the Supreme Court',
    'The president and the Senate',
    'The Cabinet and the Senate',
    'The House of Representatives and the Electoral College',
    'The Senate and the Department of Justice',
    'The Federal Assembly and the Senate',
    'The House and the National Legislature',
    'The Senate and the House of Lords',
  ],

  20: [
    // Q: Name one power of the U.S. Congress.
    // Correct: Writes laws, declares war, makes federal budget
    'Appoints Supreme Court justices',
    'Vetoes bills',
    'Commands the military',
    'Sets foreign policy',
    'Pardons criminals',
    'Enforces laws',
    'Issues executive orders',
    'Appoints Cabinet members',
  ],

  21: [
    // Q: How many U.S. senators are there?
    // Correct: 100
    '50',
    '75',
    '200',
    '435',
    '535',
    '48',
    '52',
    '102',
  ],

  22: [
    // Q: How long is a term for a U.S. senator?
    // Correct: Six (6) years
    'Two (2) years',
    'Four (4) years',
    'Eight (8) years',
    'Ten (10) years',
    'Life',
    'Three (3) years',
    'Five (5) years',
    'Until recalled by their state',
  ],

  23: [
    // Q: Who is one of your state's U.S. senators now?
    // Correct: Varies by state
    'The governor of the state',
    'The state attorney general',
    'The state secretary of state',
    'The state treasurer',
    'The state lieutenant governor',
    'The state chief justice',
    'The state\'s Speaker of the House',
    'The state comptroller',
  ],

  24: [
    // Q: How many voting members are in the House of Representatives?
    // Correct: 435
    '100',
    '200',
    '300',
    '400',
    '500',
    '535',
    '50',
    '250',
  ],

  25: [
    // Q: How long is a term for a member of the House of Representatives?
    // Correct: Two (2) years
    'One (1) year',
    'Three (3) years',
    'Four (4) years',
    'Six (6) years',
    'Eight (8) years',
    'Ten (10) years',
    'Life',
    'Five (5) years',
  ],

  26: [
    // Q: Why do U.S. representatives serve shorter terms than U.S. senators?
    // Correct: To more closely follow public opinion
    'Because they represent fewer people',
    'Because the House was created after the Senate',
    'To give more people the chance to serve',
    'Because the Constitution required it arbitrarily',
    'To keep representatives from gaining too much power',
    'Because local issues change more quickly than national ones',
    'To allow more frequent redistricting',
    'So elections cost less money',
  ],

  27: [
    // Q: How many senators does each state have?
    // Correct: Two (2)
    'One (1)',
    'Three (3)',
    'Four (4)',
    'Depends on the state\'s population',
    'Depends on when the state joined the Union',
    'Six (6)',
    'Two for large states, one for small states',
    'Ten (10)',
  ],

  28: [
    // Q: Why does each state have two senators?
    // Correct: Equal representation / The Great Compromise
    'Because there are two major political parties',
    'Because the Senate has 100 seats and there are 50 states',
    'To represent rural and urban areas',
    'Because of the Electoral College system',
    'To balance the power of the House',
    'Because of the Articles of Confederation',
    'To give small and large states equal power in the House',
    'Because the Constitution limits senators per state',
  ],

  29: [
    // Q: Name your U.S. representative.
    // Correct: Suhas Subramanyam (VA-10)
    'Bobby Scott',
    'James Walkinshaw',
    'Morgan Griffith',
    'John McGuire',
    'Eugene Vindman',
    'Jen Kiggans',
  ],

  30: [
    // Q: What is the name of the Speaker of the House of Representatives now?
    // Correct: Current speaker (varies)
    'Mitch McConnell',
    'Nancy Pelosi',
    'Chuck Schumer',
    'Kevin McCarthy',
    'Paul Ryan',
    'John Boehner',
    'Dennis Hastert',
    'Newt Gingrich',
  ],

  31: [
    // Q: Who does a U.S. senator represent?
    // Correct: Citizens of their state
    'Citizens of their congressional district',
    'Citizens of the entire country',
    'Citizens who voted for them',
    'All residents of their state, including non-citizens',
    'Members of their political party',
    'The state government officials',
    'Citizens of neighboring states',
    'All people in their geographic region',
  ],

  32: [
    // Q: Who elects U.S. senators?
    // Correct: Citizens from their state
    'The state legislature',
    'The governor of the state',
    'Citizens from across the country',
    'The Electoral College',
    'Members of the House of Representatives',
    'The state supreme court',
    'Members of their political party',
    'The president',
  ],

  33: [
    // Q: Who does a member of the House of Representatives represent?
    // Correct: Citizens in their congressional district
    'Citizens of the entire state',
    'Citizens of the entire country',
    'Citizens who voted for them',
    'All residents of their city',
    'Citizens of neighboring districts',
    'Citizens of their party',
    'Citizens of their county',
    'All registered voters in their state',
  ],

  34: [
    // Q: Who elects members of the House of Representatives?
    // Correct: Citizens from their congressional district
    'Citizens from across their state',
    'Citizens from across the country',
    'The state legislature',
    'The governor',
    'Members of the Senate',
    'The Electoral College',
    'Citizens of neighboring districts',
    'Party officials',
  ],

  35: [
    // Q: Some states have more representatives than other states. Why?
    // Correct: Because of the state's population
    'Because of the state\'s geographic size',
    'Because of the state\'s wealth',
    'Because of when the state joined the Union',
    'Because of the number of counties in the state',
    'Because of the state\'s military contribution',
    'Because of the state\'s economic output',
    'Because the state has more cities',
    'Because of historical agreements between states',
  ],

  36: [
    // Q: The President of the United States is elected for how many years?
    // Correct: Four (4) years
    'Two (2) years',
    'Three (3) years',
    'Five (5) years',
    'Six (6) years',
    'Eight (8) years',
    'Ten (10) years',
    'Life',
    'Until voted out',
  ],

  37: [
    // Q: The President can serve only two terms. Why?
    // Correct: 22nd Amendment / To keep president from becoming too powerful
    'Because of the 10th Amendment',
    'Because of the 14th Amendment',
    'Because of the 17th Amendment',
    'Because of the 25th Amendment',
    'To give the Vice President a chance to serve',
    'To save money on presidential campaigns',
    'Because of a tradition started by Abraham Lincoln',
    'To allow more people to become president',
  ],

  38: [
    // Q: What is the name of the President of the United States now?
    // Correct: Current president (varies)
    'Barack Obama',
    'George W. Bush',
    'Bill Clinton',
    'George H.W. Bush',
    'Ronald Reagan',
    'Jimmy Carter',
    'Gerald Ford',
    'Richard Nixon',
  ],

  39: [
    // Q: What is the name of the Vice President of the United States now?
    // Correct: Current VP (varies)
    'Mike Pence',
    'Joe Biden',
    'Dick Cheney',
    'Al Gore',
    'Dan Quayle',
    'George H.W. Bush',
    'Walter Mondale',
    'Nelson Rockefeller',
  ],

  40: [
    // Q: If the president can no longer serve, who becomes president?
    // Correct: The Vice President
    'The Speaker of the House',
    'The Secretary of State',
    'The Chief Justice of the Supreme Court',
    'The Senate Majority Leader',
    'The Secretary of Defense',
    'The Attorney General',
    'The President pro tempore of the Senate',
    'The Secretary of the Treasury',
  ],

  41: [
    // Q: Name one power of the president.
    // Correct: Signs bills into law, vetoes bills, enforces laws, Commander in Chief, chief diplomat, appoints federal judges
    'Writes laws',
    'Declares war unilaterally',
    'Sets the federal budget',
    'Appoints members of Congress',
    'Creates federal courts',
    'Overrules Supreme Court decisions',
    'Collects taxes',
    'Amends the Constitution',
  ],

  42: [
    // Q: Who is Commander in Chief of the U.S. military?
    // Correct: The President
    'The Secretary of Defense',
    'The Chairman of the Joint Chiefs of Staff',
    'The Vice President',
    'The Speaker of the House',
    'The Senate Majority Leader',
    'The Director of National Intelligence',
    'The Attorney General',
    'The National Security Advisor',
  ],

  43: [
    // Q: Who signs bills to become laws?
    // Correct: The President
    'The Speaker of the House',
    'The Senate Majority Leader',
    'The Chief Justice',
    'The Vice President',
    'The Secretary of State',
    'The Attorney General',
    'The majority of Supreme Court justices',
    'Both the Speaker and the Senate Majority Leader',
  ],

  44: [
    // Q: Who vetoes bills?
    // Correct: The President
    'The Supreme Court',
    'The Vice President',
    'The Speaker of the House',
    'The Senate Majority Leader',
    'The Chief Justice',
    'The Attorney General',
    'The Electoral College',
    'The Secretary of State',
  ],

  45: [
    // Q: Who appoints federal judges?
    // Correct: The President
    'The Supreme Court',
    'The Senate',
    'The House of Representatives',
    'The Attorney General',
    'The Chief Justice',
    'The Electoral College',
    'The Vice President',
    'The Department of Justice',
  ],

  46: [
    // Q: The executive branch has many parts. Name one.
    // Correct: President, Cabinet, federal departments and agencies
    'The Supreme Court',
    'The Senate',
    'The House of Representatives',
    'The Electoral College',
    'State governments',
    'The Federal Reserve',
    'The National Guard',
    'The Congressional Budget Office',
  ],

  47: [
    // Q: What does the President's Cabinet do?
    // Correct: Advises the President
    'Writes laws for the president to sign',
    'Approves presidential nominations',
    'Represents the president in foreign countries',
    'Controls the federal budget',
    'Commands the military branches',
    'Reviews laws passed by Congress',
    'Elects the vice president',
    'Sets foreign policy without presidential approval',
  ],

  48: [
    // Q: What are two Cabinet-level positions?
    // Correct: Attorney General, Secretaries of various departments, VP, etc.
    'Speaker of the House',
    'Senate Majority Leader',
    'Chief Justice of the Supreme Court',
    'Chairman of the Joint Chiefs of Staff',
    'Director of the FBI',
    'President of the Senate',
    'Comptroller General',
    'Director of the Census Bureau',
  ],

  49: [
    // Q: Why is the Electoral College important?
    // Correct: Decides who is elected president; compromise between popular election and congressional selection
    'It counts the popular vote in each state',
    'It approves new amendments to the Constitution',
    'It certifies that candidates are eligible to run',
    'It decides who wins congressional elections',
    'It selects the Vice President independently',
    'It resolves disputed Supreme Court appointments',
    'It confirms Cabinet nominees',
    'It oversees presidential impeachment proceedings',
  ],

  50: [
    // Q: What is one part of the judicial branch?
    // Correct: Supreme Court, Federal Courts
    'The Senate',
    'The House of Representatives',
    'The Cabinet',
    'The Electoral College',
    'The Department of Justice',
    'The FBI',
    'State legislatures',
    'The Attorney General\'s office',
  ],

  51: [
    // Q: What does the judicial branch do?
    // Correct: Reviews/explains laws; resolves disputes; decides if law violates Constitution
    'Writes laws',
    'Enforces laws',
    'Signs bills into law',
    'Collects taxes',
    'Commands the military',
    'Appoints Cabinet members',
    'Sets foreign policy',
    'Creates the federal budget',
  ],

  52: [
    // Q: What is the highest court in the United States?
    // Correct: Supreme Court
    'The U.S. Court of Appeals',
    'The U.S. District Court',
    'The Federal Circuit Court',
    'The U.S. Court of Federal Claims',
    'The Court of International Trade',
    'The U.S. Court of Military Appeals',
    'The National Court of Justice',
    'The Constitutional Court',
  ],

  53: [
    // Q: How many seats are on the Supreme Court?
    // Correct: 9
    '5',
    '7',
    '8',
    '10',
    '11',
    '12',
    '13',
    '15',
  ],

  54: [
    // Q: How many Supreme Court justices are usually needed to decide a case?
    // Correct: Five (5)
    'Three (3)',
    'Four (4)',
    'Six (6)',
    'Seven (7)',
    'Eight (8)',
    'Nine (9)',
    'All of them unanimously',
    'A two-thirds majority',
  ],

  55: [
    // Q: How long do Supreme Court justices serve?
    // Correct: For life / lifetime appointment / until retirement
    'Four (4) years',
    'Six (6) years',
    'Ten (10) years',
    'Twenty (20) years',
    'Until age 70',
    'Until age 75',
    'Until Congress votes to remove them',
    'Eight (8) years',
  ],

  56: [
    // Q: Supreme Court justices serve for life. Why?
    // Correct: To be independent of politics / limit outside political influence
    'Because no one has ever challenged it',
    'To save money on confirmation hearings',
    'Because they are appointed by life-term presidents',
    'To give them time to master constitutional law',
    'To match the terms of senators',
    'So that more people can become justices',
    'Because the Constitution requires it for all federal judges',
    'To ensure older and wiser justices decide cases',
  ],

  57: [
    // Q: Who is the Chief Justice of the United States now?
    // Correct: John Roberts
    'Brett Kavanaugh',
    'Antonin Scalia',
    'JD Vance',
    'Neil Gorsuch',
    'Amy Coney Barrett',
  ],

  58: [
    // Q: Name one power that is only for the federal government.
    // Correct: Print money, mint coins, declare war, create army, make treaties, set foreign policy
    'Provide police protection',
    'Issue driver\'s licenses',
    'Set speed limits on roads',
    'Regulate marriage and divorce',
    'Run public schools',
    'Collect property taxes',
    'Issue hunting and fishing licenses',
    'Approve zoning laws',
  ],

  59: [
    // Q: Name one power that is only for the states.
    // Correct: Schooling, police, fire departments, driver\'s license, zoning
    'Print paper money',
    'Declare war',
    'Create an army',
    'Make treaties with foreign countries',
    'Set foreign policy',
    'Regulate interstate commerce',
    'Issue passports',
    'Establish a post office',
  ],

  60: [
    // Q: What is the purpose of the 10th Amendment?
    // Correct: Powers not given to federal government belong to states or to the people
    'It protects freedom of speech',
    'It gives all citizens the right to vote',
    'It abolishes slavery',
    'It establishes the right to bear arms',
    'It sets the president\'s term limits',
    'It gives Congress the power to tax',
    'It establishes the Supreme Court',
    'It protects against unreasonable searches',
  ],

  61: [
    // Q: Who is the governor of your state now?
    // Correct: Varies by state
    'The state attorney general',
    'The state treasurer',
    'The senior U.S. senator from the state',
    'The state chief justice',
    'The state lieutenant governor',
    'The state secretary of state',
    'The state comptroller',
    'The state auditor',
  ],

  62: [
    // Q: What is the capital of your state?
    // Correct: Varies by state
    'The largest city in the state',
    'The oldest city in the state',
    'The most populous city in the state',
    'The city where the state university is located',
    'The city where the governor lives',
    'The city with the largest port',
    'The city closest to Washington, D.C.',
    'The city where the state was founded',
  ],

  // ── C: Rights and Responsibilities ───────────────────────────────────────

  63: [
    // Q: There are four amendments about who can vote. Describe one.
    // Correct: 18+ can vote; no poll tax; any citizen (women and men); male of any race
    'Only landowners can vote',
    'You must pass a literacy test to vote',
    'Citizens must be 21 to vote',
    'Only citizens born in the United States can vote',
    'Convicted felons permanently lose the right to vote',
    'You must pay a registration fee to vote',
    'Only English-speaking citizens can vote',
    'Non-citizens may vote in local elections',
  ],

  64: [
    // Q: Who can vote in federal elections, run for federal office, and serve on a jury?
    // Correct: Citizens / U.S. citizens
    'Any permanent resident',
    'Any person living in the United States',
    'Any person paying federal taxes',
    'Any person over 18 living legally in the U.S.',
    'Any person who has passed a civics test',
    'Any person who speaks English',
    'Any person born in the United States',
    'Any legal immigrant with a green card',
  ],

  65: [
    // Q: What are three rights of everyone living in the United States?
    // Correct: Freedom of expression, speech, assembly, petition, religion, right to bear arms
    'The right to work',
    'The right to free housing',
    'The right to vote',
    'The right to own land',
    'The right to a government job',
    'The right to free education through college',
    'The right to health care',
    'The right to receive welfare benefits',
  ],

  66: [
    // Q: What do we show loyalty to when we say the Pledge of Allegiance?
    // Correct: The United States / The flag
    'The president',
    'The Constitution',
    'The military',
    'The Congress',
    'The Supreme Court',
    'The Democratic and Republican parties',
    'The Declaration of Independence',
    'The governor of your state',
  ],

  67: [
    // Q: Name two promises that new citizens make in the Oath of Allegiance.
    // Correct: Give up loyalty to other countries; defend the Constitution; obey the laws; serve in military; serve the nation; be loyal to the U.S.
    'Pay higher taxes than non-citizens',
    'Learn to speak English fluently within one year',
    'Give up their foreign passport immediately',
    'Vote in every federal election',
    'Move to the United States within six months',
    'Renounce any foreign property',
    'Attend citizenship classes annually',
    'Register for a government identification card',
  ],

  68: [
    // Q: How can people become United States citizens?
    // Correct: Born in U.S. (14th Amendment conditions); naturalize; derive citizenship
    'By marrying a U.S. citizen automatically',
    'By living in the U.S. for five years',
    'By paying a citizenship fee',
    'By passing a language test only',
    'By serving in the military for two years',
    'By being employed by the U.S. government',
    'By purchasing property in the United States',
    'By winning the diversity visa lottery',
  ],

  69: [
    // Q: What are two examples of civic participation in the United States?
    // Correct: Vote, run for office, join a political party, help with a campaign, join a civic/community group, contact elected officials, support/oppose an issue, write to a newspaper
    'Pay your federal income taxes',
    'Obey traffic laws',
    'Maintain a valid driver\'s license',
    'Keep your address updated with the post office',
    'Attend church or religious services',
    'Purchase health insurance',
    'Complete the census form',
    'Maintain a valid passport',
  ],

  70: [
    // Q: What is one way Americans can serve their country?
    // Correct: Vote, pay taxes, obey the law, serve in military, run for office, work for government
    'Apply for a federal loan',
    'Purchase U.S. savings bonds',
    'Attend public school',
    'Fly the American flag',
    'Learn American history',
    'Travel abroad as a cultural ambassador',
    'Donate to political campaigns',
    'Subscribe to a national newspaper',
  ],

  71: [
    // Q: Why is it important to pay federal taxes?
    // Correct: Required by law; all people fund the federal government; required by Constitution (16th Amendment); civic duty
    'To fund state governments',
    'To pay the salaries of state police',
    'Because the Declaration of Independence requires it',
    'To fund local schools directly',
    'To pay for city services',
    'Because it is a tradition since colonial times',
    'To support charities chosen by the government',
    'Because the Supreme Court requires it',
  ],

  72: [
    // Q: Why is it important for men 18–25 to register for the Selective Service?
    // Correct: Required by law; civic duty; makes the draft fair if needed
    'So they can automatically vote in all elections',
    'So they can receive federal student loans (not the civics answer)',
    'Because it gives them access to government jobs',
    'Because it is required to get a driver\'s license',
    'To be eligible for the National Guard',
    'So they can receive a Social Security number',
    'To be eligible for federal housing assistance',
    'Because it is required to open a bank account',
  ],

  // ── AMERICAN HISTORY: A: Colonial Period and Independence ────────────────

  73: [
    // Q: The colonists came to America for many reasons. Name one.
    // Correct: Freedom, political liberty, religious freedom, economic opportunity, escape persecution
    'To find gold and silver',
    'To establish a monarchy',
    'To conquer Native Americans',
    'To build the transcontinental railroad',
    'To spread democracy to the world',
    'To avoid paying taxes in Europe',
    'To establish the first democracy',
    'To trade with Asian countries',
  ],

  74: [
    // Q: Who lived in America before the Europeans arrived?
    // Correct: American Indians / Native Americans
    'African Americans',
    'Spanish settlers',
    'Asian immigrants',
    'French explorers',
    'Norse Vikings (as a lasting settlement)',
    'British colonists',
    'Mexican settlers',
    'Chinese laborers',
  ],

  75: [
    // Q: What group of people was taken and sold as slaves?
    // Correct: Africans / People from Africa
    'Native Americans exclusively',
    'European indentured servants',
    'Irish immigrants',
    'Chinese laborers',
    'Caribbean islanders',
    'South American colonists',
    'Middle Eastern traders',
    'Asian immigrants',
  ],

  76: [
    // Q: What war did the Americans fight to win independence from Britain?
    // Correct: American Revolution / Revolutionary War / War for Independence
    'The Civil War',
    'The French and Indian War',
    'The War of 1812',
    'The Spanish-American War',
    'The Mexican-American War',
    'World War I',
    'The Seven Years\' War',
    'The Hundred Years\' War',
  ],

  77: [
    // Q: Name one reason why the Americans declared independence from Britain.
    // Correct: High taxes, taxation without representation, soldiers quartered in homes, no self-government, various acts
    'Britain refused to allow colonists to own land',
    'Britain outlawed the English language in the colonies',
    'Britain forced colonists to convert to Anglicanism',
    'Britain banned trade with all other nations',
    'Britain imposed a military draft on colonists',
    'Britain refused to allow colonists to form churches',
    'Britain restricted immigration to the colonies',
    'Britain required colonists to speak French',
  ],

  78: [
    // Q: Who wrote the Declaration of Independence?
    // Correct: (Thomas) Jefferson
    'Benjamin Franklin',
    'George Washington',
    'John Adams',
    'James Madison',
    'Alexander Hamilton',
    'John Hancock',
    'Samuel Adams',
    'Patrick Henry',
  ],

  79: [
    // Q: When was the Declaration of Independence adopted?
    // Correct: July 4, 1776
    'July 4, 1775',
    'July 4, 1777',
    'June 4, 1776',
    'August 2, 1776',
    'September 17, 1787',
    'March 4, 1789',
    'July 4, 1783',
    'June 15, 1775',
  ],

  80: [
    // Q: The American Revolution had many important events. Name one.
    // Correct: Battle of Bunker Hill, Declaration of Independence, Battle of Saratoga, Valley Forge, Battle of Yorktown, Washington Crossing the Delaware
    'The Battle of Gettysburg',
    'The Battle of Antietam',
    'The Battle of Bull Run',
    'The Battle of Midway',
    'The Battle of New Orleans',
    'The Battle of the Alamo',
    'The Battle of Vicksburg',
    'The Battle of Chancellorsville',
  ],

  81: [
    // Q: There were 13 original states. Name five.
    // Correct: NH, MA, RI, CT, NY, NJ, PA, DE, MD, VA, NC, SC, GA
    'Vermont',
    'Kentucky',
    'Tennessee',
    'Ohio',
    'Maine',
    'Florida',
    'Louisiana',
    'Indiana',
  ],

  82: [
    // Q: What founding document was written in 1787?
    // Correct: (U.S.) Constitution
    'The Declaration of Independence',
    'The Bill of Rights',
    'The Articles of Confederation',
    'The Federalist Papers',
    'The Emancipation Proclamation',
    'The Mayflower Compact',
    'The Northwest Ordinance',
    'The Treaty of Paris',
  ],

  83: [
    // Q: The Federalist Papers — name one of the writers.
    // Correct: (James) Madison, (Alexander) Hamilton, (John) Jay, Publius
    'Thomas Jefferson',
    'George Washington',
    'Benjamin Franklin',
    'John Adams',
    'Patrick Henry',
    'Samuel Adams',
    'Thomas Paine',
    'John Hancock',
  ],

  84: [
    // Q: Why were the Federalist Papers important?
    // Correct: Helped people understand / supported passing the Constitution
    'They argued against the Constitution',
    'They established the Bill of Rights',
    'They created the three branches of government',
    'They freed the slaves',
    'They declared war on Britain',
    'They outlined the Articles of Confederation',
    'They established the Electoral College',
    'They created the Supreme Court',
  ],

  85: [
    // Q: Benjamin Franklin is famous for many things. Name one.
    // Correct: Founded first free public libraries; First Postmaster General; helped write Declaration of Independence; inventor; U.S. diplomat
    'First president of the United States',
    'General of the Continental Army',
    'Writer of the U.S. Constitution',
    'Led the Boston Tea Party',
    'First Chief Justice of the Supreme Court',
    'Second president of the United States',
    'Author of the Federalist Papers',
    'Governor of Pennsylvania during the Revolution',
  ],

  86: [
    // Q: George Washington is famous for many things. Name one.
    // Correct: Father of Our Country; first president; General of Continental Army; President of Constitutional Convention
    'Wrote the Declaration of Independence',
    'Wrote the U.S. Constitution single-handedly',
    'Was the first Chief Justice',
    'Led the Boston Massacre protest',
    'Founded the University of Virginia',
    'Was the second president of the United States',
    'Signed the Emancipation Proclamation',
    'Was First Postmaster General of the United States',
  ],

  87: [
    // Q: Thomas Jefferson is famous for many things. Name one.
    // Correct: Writer of Declaration of Independence; 3rd president; Louisiana Purchase; First Secretary of State; founded U of Virginia; Virginia Statute on Religious Freedom
    'First president of the United States',
    'General of the Continental Army',
    '"Father of the Constitution"',
    'First Secretary of the Treasury',
    'One of the writers of the Federalist Papers',
    'Led the Constitutional Convention',
    'President during the War of 1812',
    'First Chief Justice of the Supreme Court',
  ],

  88: [
    // Q: James Madison is famous for many things. Name one.
    // Correct: Father of the Constitution; 4th president; president during War of 1812; Federalist Papers writer
    'Writer of the Declaration of Independence',
    'First president of the United States',
    'General of the Continental Army',
    'First Secretary of the Treasury',
    'Established the First Bank of the United States',
    'Third president of the United States',
    'Led the Boston Tea Party',
    'First Chief Justice of the Supreme Court',
  ],

  89: [
    // Q: Alexander Hamilton is famous for many things. Name one.
    // Correct: First Secretary of the Treasury; Federalist Papers; helped establish First Bank; aide to Washington; member of Continental Congress
    'Third president of the United States',
    '"Father of the Constitution"',
    'Writer of the Declaration of Independence',
    'First Chief Justice of the Supreme Court',
    'General who won the Battle of Yorktown',
    'First Postmaster General of the United States',
    'Founded the University of Virginia',
    'Governor of New York during the Revolution',
  ],

  // ── B: 1800s ──────────────────────────────────────────────────────────────

  90: [
    // Q: What territory did the United States buy from France in 1803?
    // Correct: Louisiana Territory / Louisiana
    'Florida',
    'Texas',
    'Alaska',
    'California',
    'The Oregon Territory',
    'The Northwest Territory',
    'New Mexico',
    'The Mississippi Territory',
  ],

  91: [
    // Q: Name one war fought by the United States in the 1800s.
    // Correct: War of 1812, Mexican-American War, Civil War, Spanish-American War
    'World War I',
    'World War II',
    'Korean War',
    'Vietnam War',
    'The American Revolution',
    'Persian Gulf War',
    'The French and Indian War',
    'The War in Afghanistan',
  ],

  92: [
    // Q: Name the U.S. war between the North and the South.
    // Correct: The Civil War
    'The Revolutionary War',
    'The War of 1812',
    'The Mexican-American War',
    'The Spanish-American War',
    'The Indian Wars',
    'The War of Secession (as a separate term)',
    'The War Between the Territories',
    'The Border War',
  ],

  93: [
    // Q: The Civil War had many important events. Name one.
    // Correct: Fort Sumter, Emancipation Proclamation, Vicksburg, Gettysburg, Sherman\'s March, Appomattox, Antietam, Lincoln assassinated
    'Declaration of Independence',
    'Battle of Bunker Hill',
    'Battle of Saratoga',
    'Valley Forge',
    'Battle of New Orleans (1815)',
    'Battle of Midway',
    'Boston Tea Party',
    'Battle of the Alamo',
  ],

  94: [
    // Q: Abraham Lincoln is famous for many things. Name one.
    // Correct: Freed the slaves (Emancipation Proclamation); saved the Union; led U.S. during Civil War; 16th president; Gettysburg Address
    'First president of the United States',
    'Led the Continental Army',
    'Wrote the Declaration of Independence',
    '"Father of the Constitution"',
    'Purchased the Louisiana Territory',
    'Led the United States during World War I',
    'Signed the 19th Amendment',
    '15th president of the United States',
  ],

  95: [
    // Q: What did the Emancipation Proclamation do?
    // Correct: Freed the slaves / freed slaves in the Confederacy / in Confederate/Southern states
    'Ended the Civil War',
    'Gave freed slaves the right to vote',
    'Abolished slavery in all U.S. states and territories immediately',
    'Gave land to freed slaves (40 acres and a mule)',
    'Created the Freedmen\'s Bureau',
    'Ratified the 13th Amendment',
    'Established citizenship for freed slaves',
    'Freed slaves in all Union states',
  ],

  96: [
    // Q: What U.S. war ended slavery?
    // Correct: The Civil War
    'The Revolutionary War',
    'The War of 1812',
    'World War I',
    'World War II',
    'The Spanish-American War',
    'The Mexican-American War',
    'The Indian Wars',
    'The Korean War',
  ],

  97: [
    // Q: What amendment says all persons born or naturalized in the United States are U.S. citizens?
    // Correct: 14th Amendment
    '10th Amendment',
    '13th Amendment',
    '15th Amendment',
    '16th Amendment',
    '17th Amendment',
    '19th Amendment',
    '22nd Amendment',
    '26th Amendment',
  ],

  98: [
    // Q: When did all men get the right to vote?
    // Correct: After the Civil War / During Reconstruction / 15th Amendment / 1870
    '1776',
    '1789',
    '1865',
    '1868',
    '1876',
    '1900',
    '1920',
    '1964',
  ],

  99: [
    // Q: Name one leader of the women\'s rights movement in the 1800s.
    // Correct: Susan B. Anthony, Elizabeth Cady Stanton, Sojourner Truth, Harriet Tubman, Lucretia Mott, Lucy Stone
    'Eleanor Roosevelt',
    'Harriet Beecher Stowe',
    'Clara Barton',
    'Amelia Earhart',
    'Rosa Parks',
    'Betty Friedan',
    'Abigail Adams',
    'Jane Addams',
  ],

  // ── C: Recent American History and Other Important Historical Information ─

  100: [
    // Q: Name one war fought by the United States in the 1900s.
    // Correct: World War I, World War II, Korean War, Vietnam War, (Persian) Gulf War
    'The Civil War',
    'The Spanish-American War',
    'The War of 1812',
    'The Mexican-American War',
    'The Revolutionary War',
    'The War in Afghanistan (2000s)',
    'The War in Iraq (2000s)',
    'The French and Indian War',
  ],

  101: [
    // Q: Why did the United States enter World War I?
    // Correct: Germany attacked U.S. ships; to support Allied Powers; to oppose Central Powers
    'Japan bombed Pearl Harbor',
    'To liberate concentration camps in Europe',
    'Because of the assassination of Archduke Franz Ferdinand',
    'To support the Soviet Union against Germany',
    'To recover territory taken by Mexico',
    'Because of the sinking of the USS Maine',
    'To stop the spread of communism',
    'To honor the Monroe Doctrine',
  ],

  102: [
    // Q: When did all women get the right to vote?
    // Correct: 1920 / After World War I / 19th Amendment
    '1865',
    '1870',
    '1898',
    '1910',
    '1915',
    '1925',
    '1930',
    '1944',
  ],

  103: [
    // Q: What was the Great Depression?
    // Correct: Longest economic recession in modern history
    'A period of high inflation that followed World War I',
    'A drought that destroyed American farmland in the 1920s',
    'A period of rapid industrial growth in the late 1800s',
    'A financial crisis caused by the Civil War',
    'A stock market bubble that burst in the 1940s',
    'A period of mass immigration to the United States',
    'An economic boom that followed World War II',
    'A banking crisis caused by Prohibition',
  ],

  104: [
    // Q: When did the Great Depression start?
    // Correct: The Great Crash (1929) / Stock market crash of 1929
    '1919',
    '1920',
    '1925',
    '1930',
    '1933',
    '1935',
    '1939',
    '1941',
  ],

  105: [
    // Q: Who was president during the Great Depression and World War II?
    // Correct: (Franklin) Roosevelt
    'Harry Truman',
    'Woodrow Wilson',
    'Herbert Hoover',
    'Calvin Coolidge',
    'Warren Harding',
    'Dwight Eisenhower',
    'Theodore Roosevelt',
    'William Howard Taft',
  ],

  106: [
    // Q: Why did the United States enter World War II?
    // Correct: Bombing of Pearl Harbor; Japan attacked Pearl Harbor; to support Allied Powers; to oppose Axis Powers
    'Because Germany invaded Poland',
    'Because Germany sank U.S. merchant ships',
    'To support the Soviet Union against Japan',
    'Because of the assassination of an American diplomat',
    'To prevent the spread of communism in Europe',
    'Because Britain asked the U.S. to join the war',
    'Because of the Zimmermann Telegram',
    'To recover U.S. territories captured by Germany',
  ],

  107: [
    // Q: Dwight Eisenhower is famous for many things. Name one.
    // Correct: General during WWII; president at end of Korean War; 34th president; signed Federal-Aid Highway Act
    'Led the Union Army during the Civil War',
    'First president of the United States',
    'Dropped the atomic bomb on Japan',
    'Signed the Civil Rights Act of 1964',
    '32nd president of the United States',
    'Led the United States during World War I',
    'Won the Battle of Midway',
    'Signed the Marshall Plan',
  ],

  108: [
    // Q: Who was the United States\' main rival during the Cold War?
    // Correct: Soviet Union / USSR / Russia
    'China',
    'North Korea',
    'Cuba',
    'Vietnam',
    'Germany',
    'Iran',
    'North Vietnam',
    'East Germany',
  ],

  109: [
    // Q: During the Cold War, what was one main concern of the United States?
    // Correct: Communism / Nuclear war
    'Terrorism',
    'Immigration',
    'Economic depression',
    'Climate change',
    'Poverty at home',
    'Civil rights violations',
    'Drug trafficking',
    'Military coups in Latin America',
  ],

  110: [
    // Q: Why did the United States enter the Korean War?
    // Correct: To stop the spread of communism
    'Because North Korea attacked a U.S. military base',
    'To defend Japan from invasion',
    'Because China declared war on the United States',
    'To honor a treaty with the Soviet Union',
    'To recover territory captured from U.S. allies',
    'Because South Korea was a U.S. territory',
    'To support the United Nations peacekeeping mission',
    'Because of an attack on a U.S. naval vessel',
  ],

  111: [
    // Q: Why did the United States enter the Vietnam War?
    // Correct: To stop the spread of communism
    'Because North Vietnam attacked a U.S. territory',
    'To defend France\'s colonial holdings',
    'Because China invaded South Vietnam',
    'To honor a treaty with Australia',
    'Because of the fall of Saigon',
    'To protect U.S. oil interests in Southeast Asia',
    'Because the Soviet Union sent troops to Vietnam',
    'Because Japan supported North Vietnam',
  ],

  112: [
    // Q: What did the civil rights movement do?
    // Correct: Fought to end racial discrimination
    'It gave women the right to vote',
    'It ended the Vietnam War',
    'It established affirmative action programs',
    'It created the welfare system',
    'It ended poverty in America',
    'It established the Department of Civil Rights',
    'It integrated the military for the first time',
    'It repealed Prohibition',
  ],

  113: [
    // Q: Martin Luther King, Jr. is famous for many things. Name one.
    // Correct: Fought for civil rights; worked for equality; "not judged by color of skin..."
    'First African American president of the United States',
    'Led the Montgomery Bus Boycott (acceptable as part of civil rights, but not on official list)',
    'Founded the NAACP',
    'Wrote the Civil Rights Act of 1964',
    'Led the March on Washington to end the Vietnam War',
    'Was the first African American senator',
    'Founded Historically Black Colleges and Universities',
    'Was the first African American Supreme Court justice',
  ],

  114: [
    // Q: Why did the United States enter the Persian Gulf War?
    // Correct: To force the Iraqi military from Kuwait
    'To capture Saddam Hussein',
    'To protect Saudi oil fields from Iran',
    'Because Iraq attacked U.S. military bases',
    'To remove weapons of mass destruction from Iraq',
    'To support the Israeli government',
    'Because Iran invaded Kuwait',
    'To establish a democracy in Iraq',
    'To honor a treaty with Saudi Arabia',
  ],

  115: [
    // Q: What major event happened on September 11, 2001?
    // Correct: Terrorists attacked the United States; attacked World Trade Center; attacked Pentagon; crashed plane in Pennsylvania
    'The United States declared war on Iraq',
    'Hurricane Katrina struck the Gulf Coast',
    'The Oklahoma City bombing occurred',
    'The United States invaded Afghanistan',
    'North Korea tested a nuclear weapon',
    'A major earthquake struck California',
    'Anthrax letters were sent to Congress',
    'The U.S. Embassy in Kenya was bombed',
  ],

  116: [
    // Q: Name one U.S. military conflict after the September 11, 2001 attacks.
    // Correct: (Global) War on Terror, War in Afghanistan, War in Iraq
    'The Vietnam War',
    'The Korean War',
    'The Persian Gulf War',
    'The Spanish-American War',
    'The War in Libya (NATO-led, not officially named as such)',
    'The Cold War',
    'The Bay of Pigs invasion',
    'The bombing of Kosovo',
  ],

  117: [
    // Q: Name one American Indian tribe in the United States.
    // Correct: Apache, Blackfeet, Cherokee, Cheyenne, Navajo, Sioux, Mohawk, Seminole, etc.
    'Aztec',
    'Inca',
    'Maya',
    'Arawak',
    'Carib',
    'Taino',
    'Olmec',
    'Zapotec',
  ],

  118: [
    // Q: Name one example of an American innovation.
    // Correct: Light bulb, automobile, skyscrapers, airplane, assembly line, landing on the moon, integrated circuit
    'The printing press',
    'The steam engine',
    'The telephone (credit disputed, but not on official list)',
    'The railroad',
    'Penicillin',
    'The internet (ARPANET precedes it, but not on official list)',
    'The compass',
    'Gunpowder',
  ],

  // ── SYMBOLS AND HOLIDAYS ─────────────────────────────────────────────────

  119: [
    // Q: What is the capital of the United States?
    // Correct: Washington, D.C.
    'New York City',
    'Philadelphia',
    'Boston',
    'Los Angeles',
    'Chicago',
    'Baltimore',
    'Richmond',
    'Annapolis',
  ],

  120: [
    // Q: Where is the Statue of Liberty?
    // Correct: New York Harbor / Liberty Island / New Jersey / near New York City / Hudson River
    'Washington, D.C.',
    'Philadelphia, Pennsylvania',
    'Boston, Massachusetts',
    'Miami, Florida',
    'Chicago, Illinois',
    'San Francisco, California',
    'Baltimore, Maryland',
    'Norfolk, Virginia',
  ],

  121: [
    // Q: Why does the flag have 13 stripes?
    // Correct: 13 original colonies
    'One stripe for each of the first 13 presidents',
    'To represent the 13 amendments in the Bill of Rights',
    'One stripe for each original branch of government (times 4)',
    'Because 13 is a lucky number in American culture',
    'To represent the 13 years of the Revolutionary War',
    'One stripe for each of the first 13 states to ratify the Constitution',
    'To honor the 13 signers of the Declaration of Independence',
    'One stripe for each year of the Articles of Confederation',
  ],

  122: [
    // Q: Why does the flag have 50 stars?
    // Correct: One star for each state / 50 states
    'One star for each year since independence',
    'One star for each president',
    'One star for each amendment to the Constitution',
    'One star for each original colony and territory',
    'To represent the 50 largest cities in America',
    'One star for each senator (50 states × 2 ÷ 2)',
    'One star for each original member of the Continental Congress',
    'To represent the 50 years of westward expansion',
  ],

  123: [
    // Q: What is the name of the national anthem?
    // Correct: The Star-Spangled Banner
    '"America the Beautiful"',
    '"God Bless America"',
    '"My Country, \'Tis of Thee"',
    '"Yankee Doodle"',
    '"Battle Hymn of the Republic"',
    '"The Stars and Stripes Forever"',
    '"This Land Is Your Land"',
    '"America"',
  ],

  124: [
    // Q: The Nation\'s first motto was "E Pluribus Unum." What does that mean?
    // Correct: Out of many, one / We all become one
    '"In God we trust"',
    '"Liberty and justice for all"',
    '"United we stand, divided we fall"',
    '"Land of the free, home of the brave"',
    '"One nation under God"',
    '"All men are created equal"',
    '"Give me liberty or give me death"',
    '"From the people, by the people"',
  ],

  // ── B: Holidays ───────────────────────────────────────────────────────────

  125: [
    // Q: What is Independence Day?
    // Correct: A holiday to celebrate U.S. independence from Britain / the country\'s birthday
    'A holiday to honor soldiers who died in military service',
    'A holiday to honor people who have served in the U.S. military',
    'A holiday to celebrate the signing of the Constitution',
    'A holiday to honor the first president',
    'A holiday to mark the end of the Civil War',
    'A holiday to celebrate the emancipation of enslaved people',
    'A holiday to honor the founding fathers',
    'A holiday to remember those who fought in the Revolutionary War',
  ],

  126: [
    // Q: Name three national U.S. holidays.
    // Correct: New Year\'s Day, MLK Day, Presidents Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving, Christmas
    'Super Bowl Sunday',
    'Tax Day (April 15)',
    'Election Day',
    'Flag Day',
    'Earth Day',
    'St. Patrick\'s Day',
    'Valentine\'s Day',
    'Halloween',
  ],

  127: [
    // Q: What is Memorial Day?
    // Correct: A holiday to honor soldiers who died in military service
    'A holiday to honor all people who have served in the military',
    'A holiday to celebrate U.S. independence from Britain',
    'A holiday to honor the first president',
    'A holiday to remember victims of September 11',
    'A holiday to celebrate the end of World War II',
    'A holiday to honor workers and labor unions',
    'A holiday to mark the end of the Civil War',
    'A holiday to celebrate the signing of the Constitution',
  ],

  128: [
    // Q: What is Veterans Day?
    // Correct: A holiday to honor people in the U.S. military / people who have served
    'A holiday to honor soldiers who died in military service',
    'A holiday to celebrate U.S. independence',
    'A holiday to remember those killed on September 11',
    'A holiday to honor the president',
    'A holiday to mark the end of World War I (armistice day context — plausible wrong framing)',
    'A holiday to honor first responders and police',
    'A holiday to celebrate the founding of the U.S. Army',
    'A holiday to honor prisoners of war only',
  ],
}

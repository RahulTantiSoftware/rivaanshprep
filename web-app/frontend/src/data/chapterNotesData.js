// Comprehensive Class 10th NCERT Mathematics Smart Notes Dataset
// High-Yield Formula Cheatsheets, Theorems, Solved Exemplars & Exam Traps

export const CHAPTER_NOTES = {
  1: {
    id: 1,
    title: 'Real Numbers',
    badge: 'High Yield • 6 Marks',
    readTime: '10 min read',
    summary: 'The Fundamental Theorem of Arithmetic, irrationality proofs, HCF-LCM relationships, and decimal representation analysis for CBSE Class 10.',
    formulas: [
      {
        name: 'Fundamental Theorem of Arithmetic',
        formula: 'n = p₁ᵃ¹ · p₂ᵃ² ··· pₖᵃᵏ',
        explanation: 'Every composite number can be uniquely expressed (factorised) as a product of prime powers, apart from the order in which the prime factors occur.',
        tip: 'Always write prime factorisation in ascending order of primes to prevent counting errors.'
      },
      {
        name: 'HCF and LCM Product Rule',
        formula: 'HCF(a, b) × LCM(a, b) = a × b',
        explanation: 'For any two positive integers a and b, the product of their HCF and LCM equals the product of the numbers.',
        tip: 'CRITICAL: This identity holds ONLY for two numbers. For three numbers: HCF(a, b, c) × LCM(a, b, c) ≠ a × b × c.'
      },
      {
        name: 'HCF & LCM by Prime Factorisation',
        formula: 'HCF = Product of smallest powers of common prime factors\nLCM = Product of greatest powers of all prime factors involved',
        explanation: 'Take common primes with lowest exponent for HCF; take all primes with highest exponent for LCM.',
        tip: 'Check: LCM must always be divisible by HCF.'
      }
    ],
    theorems: [
      {
        title: 'Theorem 1.1: Irrationality of √p (where p is prime)',
        statement: 'Let p be a prime number. If p divides a², where a is a positive integer, then p divides a.',
        proofOrMethod: 'Method of Contradiction:\n1. Assume √p = a/b is rational, where a and b are co-prime integers (HCF(a, b) = 1) and b ≠ 0.\n2. Square both sides: p = a²/b²  =>  a² = p·b².\n3. Therefore, p divides a², which implies p divides a (Theorem 1.1). Let a = p·c for some integer c.\n4. Substitute: (p·c)² = p·b²  =>  p²·c² = p·b²  =>  b² = p·c².\n5. Therefore, p divides b², which implies p divides b.\n6. Thus, p is a common factor of both a and b, contradicting the assumption that a and b are co-prime.\n7. Hence, √p is irrational.',
        examImportance: 'Guaranteed 3-Mark question in Board Exams.'
      }
    ],
    solvedExamples: [
      {
        problem: 'Given that HCF(306, 657) = 9, find LCM(306, 657).',
        boardYear: 'CBSE 2024 / 2022',
        solution: 'Using the fundamental relation:\nLCM(a, b) = (a × b) / HCF(a, b)\n\nLCM(306, 657) = (306 × 657) / 9\n              = 34 × 657\n              = 22,338'
      },
      {
        problem: 'Prove that 3 + 2√5 is irrational, given that √5 is irrational.',
        boardYear: 'CBSE 2023',
        solution: '1. Assume 3 + 2√5 is rational = a/b, where a, b ∈ Z and b ≠ 0.\n2. Rearrange: 2√5 = a/b - 3 = (a - 3b)/b\n3. √5 = (a - 3b)/(2b)\n4. Since a and b are integers, (a - 3b)/(2b) is rational.\n5. This implies √5 is rational, which contradicts the given fact that √5 is irrational.\n6. Hence, our assumption is false and 3 + 2√5 is irrational.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Applying HCF(a, b, c) × LCM(a, b, c) = a × b × c for 3 numbers.',
        correction: 'Use prime factorisation individually for 3 numbers. The product formula only applies to pairs.'
      },
      {
        mistake: 'Forgetting to state that a and b are co-prime in √p proofs.',
        correction: 'Writing "where a and b are co-prime integers with b ≠ 0" carries 0.5 to 1 mark in CBSE evaluation scheme.'
      }
    ]
  },

  2: {
    id: 2,
    title: 'Polynomials',
    badge: 'Core Algebra • 4-5 Marks',
    readTime: '12 min read',
    summary: 'Relationship between zeroes and coefficients of quadratic and cubic polynomials, geometric representation of zeroes, and formation of quadratic polynomials.',
    formulas: [
      {
        name: 'Quadratic Polynomial Zeroes Relation',
        formula: 'Sum of Zeroes (α + β) = -b/a = -(Coefficient of x) / (Coefficient of x²)\nProduct of Zeroes (α · β) = c/a = (Constant term) / (Coefficient of x²)',
        explanation: 'For a quadratic polynomial p(x) = ax² + bx + c (a ≠ 0) with roots α and β.',
        tip: 'Always verify signs! Note the negative sign in -b/a.'
      },
      {
        name: 'Formation of Quadratic Polynomial',
        formula: 'p(x) = k · [x² - (α + β)x + αβ]  (where k is any non-zero real constant)',
        explanation: 'If sum S and product P of zeroes are known: p(x) = k(x² - Sx + P).',
        tip: 'Choose k to eliminate fractions in coefficients.'
      },
      {
        name: 'Useful Algebraic Identities for Roots',
        formula: '• α² + β² = (α + β)² - 2αβ\n• (α - β)² = (α + β)² - 4αβ\n• α³ + β³ = (α + β)(α² - αβ + β²) = (α + β)³ - 3αβ(α + β)',
        explanation: 'Essential for finding symmetric expressions in α and β without calculating individual roots.',
        tip: 'Directly substitute S = -b/a and P = c/a.'
      }
    ],
    theorems: [
      {
        title: 'Geometrical Meaning of the Zeroes of a Polynomial',
        statement: 'The zeroes of a polynomial p(x) are precisely the X-coordinates of the points where the graph of y = p(x) intersects the X-axis.',
        proofOrMethod: '1. A linear polynomial ax + b intersects X-axis at exactly 1 point: (-b/a, 0).\n2. A quadratic polynomial ax² + bx + c is a parabola:\n   - Opens upward if a > 0; opens downward if a < 0.\n   - Case I: Intersects X-axis at 2 distinct points (2 zeroes).\n   - Case II: Touches X-axis at exactly 1 point (2 equal zeroes).\n   - Case III: Does not touch or intersect X-axis (no real zeroes).\n3. A polynomial of degree n has at most n real zeroes.',
        examImportance: 'Common 1-mark graph question.'
      }
    ],
    solvedExamples: [
      {
        problem: 'Find a quadratic polynomial whose sum and product of zeroes are -1/4 and 1/4 respectively.',
        boardYear: 'NCERT Exemplar / CBSE 2023',
        solution: 'Let the zeroes be α and β.\nSum of zeroes (S) = α + β = -1/4\nProduct of zeroes (P) = α · β = 1/4\n\nThe required polynomial is:\np(x) = k · [x² - Sx + P]\n     = k · [x² - (-1/4)x + 1/4]\n     = k · [x² + (1/4)x + 1/4]\n\nTaking k = 4 to clear fractions:\np(x) = 4x² + x + 1'
      }
    ],
    pitfalls: [
      {
        mistake: 'Counting intersections with Y-axis as zeroes.',
        correction: 'Zeroes of p(x) are ONLY intersections with the X-axis (where y = 0).'
      }
    ]
  },

  3: {
    id: 3,
    title: 'Pair of Linear Equations in Two Variables',
    badge: 'System of Equations • 6 Marks',
    readTime: '15 min read',
    summary: 'Master graphical and algebraic conditions of consistency, substitution method, elimination method, and board word problems (upstream/downstream, age, digit reversal).',
    formulas: [
      {
        name: 'Consistency & Ratio Test Matrix',
        formula: 'For a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0:\n1. a₁/a₂ ≠ b₁/b₂  =>  Intersecting lines, Unique solution, Consistent\n2. a₁/a₂ = b₁/b₂ = c₁/c₂  =>  Coincident lines, Infinitely many solutions, Consistent (Dependent)\n3. a₁/a₂ = b₁/b₂ ≠ c₁/c₂  =>  Parallel lines, No solution, Inconsistent',
        explanation: 'Check ratios before solving algebraically to determine solvability instantly.',
        tip: 'Ensure equations are in the same standard form before comparing ratios.'
      },
      {
        name: 'Speed of Boat and Stream',
        formula: '• Downstream Speed = (u + v) km/h\n• Upstream Speed = (u - v) km/h\n(where u = speed in still water, v = speed of stream)',
        explanation: 'Time = Distance / Speed. Always u > v.',
        tip: 'Set up: t₁ = d/(u-v) and t₂ = d/(u+v).'
      }
    ],
    theorems: [
      {
        title: 'Algebraic Solving Methods',
        statement: 'Comparison between Substitution and Elimination methods.',
        proofOrMethod: '• Substitution: Express one variable in terms of the other from equation 1 and substitute into equation 2.\n• Elimination: Multiply equations by suitable non-zero constants to equalize coefficients of one variable, then add or subtract.',
        examImportance: 'Used in 4-mark application word problems.'
      }
    ],
    solvedExamples: [
      {
        problem: 'For what value of k will the system of equations kx + 3y - (k - 3) = 0 and 12x + ky - k = 0 have infinitely many solutions?',
        boardYear: 'CBSE 2020 / 2023',
        solution: 'For infinitely many solutions:\na₁/a₂ = b₁/b₂ = c₁/c₂\n\nk/12 = 3/k = (k - 3)/k\n\nFrom first pair: k/12 = 3/k  =>  k² = 36  =>  k = ±6.\nFrom second pair: 3/k = (k - 3)/k  =>  3 = k - 3 (for k ≠ 0)  =>  k = 6.\n\nSince k = 6 satisfies all conditions:\nk = 6.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Taking k = -6 when k = 6 is the only common solution.',
        correction: 'Always verify both ratio equations; only the value satisfying ALL conditions is valid.'
      }
    ]
  },

  4: {
    id: 4,
    title: 'Quadratic Equations',
    badge: 'Core Algebra • 6-7 Marks',
    readTime: '14 min read',
    summary: 'Standard form ax² + bx + c = 0, discriminant nature of roots, factorization method, quadratic formula, and real-life projectile & speed word problems.',
    formulas: [
      {
        name: 'The Quadratic Formula (Shreedharacharya Rule)',
        formula: 'x = [-b ± √(b² - 4ac)] / (2a)',
        explanation: 'Provides exact roots for any quadratic equation ax² + bx + c = 0 with a ≠ 0.',
        tip: 'Calculate the discriminant D = b² - 4ac first to verify real roots exist.'
      },
      {
        name: 'Discriminant (D) & Nature of Roots',
        formula: 'D = b² - 4ac\n• D > 0: Two distinct real roots: x = (-b ± √D) / 2a\n• D = 0: Two equal real roots: x = -b / (2a)\n• D < 0: No real roots',
        explanation: 'Determines the number and type of solutions without fully solving the equation.',
        tip: 'If question states "has equal roots", immediately write D = b² - 4ac = 0.'
      }
    ],
    theorems: [
      {
        title: 'Condition for Real Roots',
        statement: 'A quadratic equation has real roots if and only if D = b² - 4ac ≥ 0.',
        proofOrMethod: 'Derived directly from completing the square:\n(x + b/2a)² = (b² - 4ac) / (4a²).\nSince the LHS is a square, it must be non-negative for real x, requiring b² - 4ac ≥ 0.',
        examImportance: 'Used in parameter-finding problems (find k such that...).'
      }
    ],
    solvedExamples: [
      {
        problem: 'Find the value of k for which the quadratic equation (k - 12)x² + 2(k - 12)x + 2 = 0 has equal roots.',
        boardYear: 'CBSE 2022',
        solution: 'For equal roots, D = b² - 4ac = 0.\nHere, a = k - 12, b = 2(k - 12), c = 2.\n\nD = [2(k - 12)]² - 4(k - 12)(2) = 0\n4(k - 12)² - 8(k - 12) = 0\n4(k - 12)[(k - 12) - 2] = 0\n4(k - 12)(k - 14) = 0\n\nk = 12 or k = 14.\n\nCRITICAL CHECK: If k = 12, the coefficient of x² becomes 0, so it is no longer quadratic!\nTherefore, k = 14 is the only valid solution.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Retaining k = 12 when it makes a = 0.',
        correction: 'In ax² + bx + c = 0, the definition requires a ≠ 0. Always discard values that make a = 0.'
      }
    ]
  },

  5: {
    id: 5,
    title: 'Arithmetic Progressions',
    badge: 'Scoring • 5-6 Marks',
    readTime: '12 min read',
    summary: 'nth term of an AP, sum of first n terms, selection of terms, and practical word problems on savings, logs, and seating arrangements.',
    formulas: [
      {
        name: 'General Term (nth Term) of an AP',
        formula: 'aₙ = a + (n - 1)d',
        explanation: 'a = first term, d = common difference (aₖ - aₖ₋₁), n = number of terms (positive integer).',
        tip: 'd can be positive, negative, or zero.'
      },
      {
        name: 'nth Term from the End of an AP',
        formula: 'aₙ(from end) = l - (n - 1)d   (where l is the last term)',
        explanation: 'Alternatively, reverse the AP with first term = l and common difference = -d.',
        tip: 'Reversing the sequence is less error-prone.'
      },
      {
        name: 'Sum of First n Terms (Sₙ)',
        formula: 'Sₙ = (n/2)[2a + (n - 1)d]  =  (n/2)[a + l]',
        explanation: 'Use the second form when first and last terms are directly known.',
        tip: 'Relationship between Sₙ and aₙ: aₙ = Sₙ - Sₙ₋₁.'
      },
      {
        name: 'Selection of Terms in AP for Symmetry',
        formula: '• 3 terms: (a - d), a, (a + d)  [Sum = 3a]\n• 4 terms: (a - 3d), (a - d), (a + d), (a + 3d)  [Common difference = 2d]\n• 5 terms: (a - 2d), (a - d), a, (a + d), (a + 2d)  [Sum = 5a]',
        explanation: 'Using symmetric terms eliminates d when sum is given, simplifying the algebra greatly.',
        tip: 'Note that for 4 terms, the common difference is 2d, not d.'
      }
    ],
    theorems: [
      {
        title: 'Formula for Sum of First n Natural Numbers',
        statement: 'Sₙ = 1 + 2 + 3 + ... + n = [n(n + 1)] / 2',
        proofOrMethod: 'Here a = 1, d = 1, l = n.\nSₙ = (n/2)(a + l) = n(1 + n)/2 = n(n + 1)/2.',
        examImportance: 'Directly applied in multiple-choice and 2-mark questions.'
      }
    ],
    solvedExamples: [
      {
        problem: 'If the sum of first 7 terms of an AP is 49 and that of 17 terms is 289, find the sum of first n terms.',
        boardYear: 'NCERT / CBSE 2023',
        solution: 'S₇ = (7/2)[2a + 6d] = 49  =>  2a + 6d = 14  =>  a + 3d = 7  --- (1)\nS₁₇ = (17/2)[2a + 16d] = 289  =>  2a + 16d = 34  =>  a + 8d = 17  --- (2)\n\nSubtracting (1) from (2):\n5d = 10  =>  d = 2.\nFrom (1): a + 3(2) = 7  =>  a = 1.\n\nNow, Sₙ = (n/2)[2(1) + (n - 1)(2)]\n        = (n/2)[2 + 2n - 2]\n        = (n/2)[2n] = n².\n\nAnswer: Sₙ = n².'
      }
    ],
    pitfalls: [
      {
        mistake: 'n coming out as a fraction or negative number.',
        correction: 'n represents term count and MUST be a positive integer (n ∈ N). If quadratic gives negative or fractional n, reject it.'
      }
    ]
  },

  6: {
    id: 6,
    title: 'Triangles',
    badge: 'Geometry Proofs • 8 Marks',
    readTime: '16 min read',
    summary: 'Basic Proportionality Theorem (Thales Theorem) with rigorous board proof, converse of BPT, and similarity criteria (AAA, SSS, SAS).',
    formulas: [
      {
        name: 'Basic Proportionality Theorem (BPT / Thales)',
        formula: 'If DE || BC in ΔABC: AD/DB = AE/EC',
        explanation: 'A line drawn parallel to one side of a triangle intersecting the other two sides divides them in the same ratio.',
        tip: 'Corollary: AD/AB = AE/AC and DB/AB = EC/AC.'
      },
      {
        name: 'Similarity Criteria',
        formula: '• AAA (or AA): Corresponding angles equal\n• SSS: Corresponding sides proportional\n• SAS: One angle equal and including sides proportional',
        explanation: 'When two triangles are similar, all corresponding sides are in the same ratio.',
        tip: 'In board proofs, write matching vertex order carefully (e.g. ΔABC ~ ΔPQR).'
      }
    ],
    theorems: [
      {
        title: 'Theorem 6.1: Basic Proportionality Theorem (Full Proof)',
        statement: 'If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.',
        proofOrMethod: 'Given: In ΔABC, line DE || BC intersects AB at D and AC at E.\nTo Prove: AD/DB = AE/EC.\nConstruction: Join BE and CD. Draw DM ⊥ AC and EN ⊥ AB.\n\nProof:\n1. Area(ΔADE) = (1/2) × Base × Height = (1/2) × AD × EN\n2. Area(ΔBDE) = (1/2) × DB × EN\n   => Area(ΔADE) / Area(ΔBDE) = AD / DB   --- (1)\n\n3. Similarly, taking AE as base: Area(ΔADE) = (1/2) × AE × DM\n4. Area(ΔCDE) = (1/2) × EC × DM\n   => Area(ΔADE) / Area(ΔCDE) = AE / EC   --- (2)\n\n5. Note that ΔBDE and ΔCDE are on the same base DE and between the same parallels DE and BC.\n   => Area(ΔBDE) = Area(ΔCDE)   --- (3)\n\nFrom (1), (2), and (3):\nAD / DB = AE / EC. (Hence Proved)',
        examImportance: 'One of the most frequently asked 5-mark proofs in CBSE history.'
      }
    ],
    solvedExamples: [
      {
        problem: 'In ΔABC, DE || BC such that AD = x, DB = x - 2, AE = x + 2, and EC = x - 1. Find the value of x.',
        boardYear: 'CBSE 2021',
        solution: 'By BPT:\nAD/DB = AE/EC\nx/(x - 2) = (x + 2)/(x - 1)\n\nCross multiply:\nx(x - 1) = (x - 2)(x + 2)\nx² - x = x² - 4\n-x = -4  =>  x = 4.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Writing ΔABC ~ ΔQPR when corresponding angles match P with A and Q with B.',
        correction: 'Order of vertices in similarity statements is mandatory. Incorrect order loses marks in CBSE checking.'
      }
    ]
  },

  7: {
    id: 7,
    title: 'Coordinate Geometry',
    badge: 'Analytic Geometry • 6 Marks',
    readTime: '11 min read',
    summary: 'Distance formula, section formula (internal division), midpoint formula, collinearity of three points, and geometrical shapes proofs.',
    formulas: [
      {
        name: 'Distance Formula',
        formula: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]',
        explanation: 'Distance of point P(x, y) from origin O(0, 0) is OP = √(x² + y²).',
        tip: 'Distance is always non-negative. Do not forget the square root.'
      },
      {
        name: 'Section Formula (Internal Division)',
        formula: 'P(x, y) = [ (m₁x₂ + m₂x₁) / (m₁ + m₂), (m₁y₂ + m₂y₁) / (m₁ + m₂) ]',
        explanation: 'Divides line segment joining A(x₁, y₁) and B(x₂, y₂) internally in ratio m₁ : m₂.',
        tip: 'When finding ratio, always assume ratio k : 1 for faster solving.'
      },
      {
        name: 'Midpoint Formula',
        formula: 'M(x, y) = [ (x₁ + x₂) / 2, (y₁ + y₂) / 2 ]',
        explanation: 'Special case of section formula where m₁ = m₂ = 1.',
        tip: 'Useful for proving diagonals of a parallelogram bisect each other.'
      }
    ],
    theorems: [
      {
        title: 'Centroid of a Triangle',
        statement: 'The centroid G of a triangle with vertices A(x₁, y₁), B(x₂, y₂), C(x₃, y₃) is given by: G = [ (x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3 ].',
        proofOrMethod: 'Centroid divides each median in the ratio 2 : 1. Apply section formula to median AD where D is midpoint of BC.',
        examImportance: 'Common in case-study and 2-mark questions.'
      }
    ],
    solvedExamples: [
      {
        problem: 'Find the ratio in which the Y-axis divides the line segment joining A(5, -6) and B(-1, -4). Also find the point of intersection.',
        boardYear: 'CBSE 2023',
        solution: 'Let the required ratio be k : 1. Any point on Y-axis has X-coordinate = 0.\nBy Section Formula:\nx = [k(-1) + 1(5)] / (k + 1) = 0\n-k + 5 = 0  =>  k = 5.\nSo ratio is 5 : 1.\n\nNow find Y-coordinate:\ny = [5(-4) + 1(-6)] / (5 + 1) = (-20 - 6) / 6 = -26/6 = -13/3.\n\nPoint of intersection: (0, -13/3).'
      }
    ],
    pitfalls: [
      {
        mistake: 'Mixing up coordinates: multiplying m₁ with x₁ instead of x₂.',
        correction: 'Remember the criss-cross rule: m₁ multiplies with point B coordinates, m₂ multiplies with point A coordinates.'
      }
    ]
  },

  8: {
    id: 8,
    title: 'Introduction to Trigonometry',
    badge: 'Trigonometry • 8-9 Marks',
    readTime: '15 min read',
    summary: 'Trigonometric ratios, values for standard angles (0°, 30°, 45°, 60°, 90°), fundamental identities and board proving questions.',
    formulas: [
      {
        name: 'Trigonometric Ratios in Right Triangle',
        formula: '• sin θ = Opposite / Hypotenuse (P/H)\n• cos θ = Adjacent / Hypotenuse (B/H)\n• tan θ = Opposite / Adjacent (P/B) = sin θ / cos θ\n• cosec θ = 1/sin θ,  sec θ = 1/cos θ,  cot θ = 1/tan θ',
        explanation: 'Always identify hypotenuse (opposite right angle) and opposite side (opposite angle θ).',
        tip: 'Mnemonic: Some People Have, Curly Brown Hair, Turned Permanent Black.'
      },
      {
        name: 'Standard Angles Table',
        formula: 'Angle θ:   0°     30°      45°      60°      90°\nsin θ:     0      1/2     1/√2     √3/2      1\ncos θ:     1     √3/2     1/√2      1/2      0\ntan θ:     0     1/√3       1       √3     Not Def',
        explanation: 'Notice sin increases 0 -> 1 while cos decreases 1 -> 0.',
        tip: 'Quick finger rule: sin = √(fingers to left)/2.'
      },
      {
        name: 'The 3 Fundamental Pythagorean Identities',
        formula: '1. sin²θ + cos²θ = 1   =>   sin²θ = 1 - cos²θ,  cos²θ = 1 - sin²θ\n2. 1 + tan²θ = sec²θ   =>   sec²θ - tan²θ = 1,  (sec θ - tan θ) = 1/(sec θ + tan θ)\n3. 1 + cot²θ = cosec²θ =>   cosec²θ - cot²θ = 1, (cosec θ - cot θ) = 1/(cosec θ + cot θ)',
        explanation: 'Cornerstone of all trigonometry proving questions.',
        tip: 'The reciprocal identity (sec θ - tan θ) = 1/(sec θ + tan θ) is a high-yield shortcut.'
      }
    ],
    theorems: [
      {
        title: 'Strategy for Proving Trigonometric Identities',
        statement: 'Standard algorithmic checklist for board exam proofs.',
        proofOrMethod: '1. Convert everything to sin θ and cos θ if no direct identity is visible.\n2. Take LCM of fractions on LHS.\n3. Rationalize denominators containing (1 ± sin θ) or (1 ± cos θ).\n4. Factorize using algebraic identities (a² - b², a³ + b³).\n5. Work on LHS until it equals RHS, or simplify both sides to a common expression.',
        examImportance: 'Guaranteed 4-mark proving question.'
      }
    ],
    solvedExamples: [
      {
        problem: 'Prove that: (sin θ - 2 sin³θ) / (2 cos³θ - cos θ) = tan θ.',
        boardYear: 'CBSE 2024 / 2020',
        solution: 'LHS = [sin θ(1 - 2 sin²θ)] / [cos θ(2 cos²θ - 1)]\n    = (sin θ / cos θ) · [(1 - 2 sin²θ) / (2(1 - sin²θ) - 1)]\n    = tan θ · [(1 - 2 sin²θ) / (2 - 2 sin²θ - 1)]\n    = tan θ · [(1 - 2 sin²θ) / (1 - 2 sin²θ)]\n    = tan θ · [1] = tan θ = RHS. (Hence Proved)'
      }
    ],
    pitfalls: [
      {
        mistake: 'Writing sin²θ as sin(θ²).',
        correction: 'sin²θ means (sin θ)². Never square the angle.'
      }
    ]
  },

  9: {
    id: 9,
    title: 'Some Applications of Trigonometry',
    badge: 'Word Problems • 4 Marks',
    readTime: '10 min read',
    summary: 'Line of sight, angle of elevation, angle of depression, two-triangle height & distance configurations (towers, ships, kites, balloons).',
    formulas: [
      {
        name: 'Angle of Elevation and Depression',
        formula: '• Elevation: Object is ABOVE horizontal line of sight.\n• Depression: Object is BELOW horizontal line of sight.\n• Angle of Depression = Angle of Alternate Interior Elevation.',
        explanation: 'Always construct a horizontal reference line from the observer’s eye first.',
        tip: 'Never draw angle of depression directly with the vertical pole/tower.'
      },
      {
        name: 'Standard Triangle Ratios',
        formula: '• For 45°: Opposite = Adjacent (since tan 45° = 1)\n• For 30°: Opposite = (1/√3) × Adjacent\n• For 60°: Opposite = √3 × Adjacent',
        explanation: 'Use √3 ≈ 1.732 when decimal answers are required.',
        tip: 'Check: As you move closer to a tower, the angle of elevation INCREASES.'
      }
    ],
    theorems: [
      {
        title: 'Two-Triangle Case Strategy',
        statement: 'Whenever two right triangles share a common side (height or base):',
        proofOrMethod: '1. Identify the common side in both triangles.\n2. Express the common side from Triangle 1 using tan.\n3. Express the common side from Triangle 2 using tan.\n4. Equate the two expressions and solve for the unknown variable.',
        examImportance: 'Used in 4-mark case study questions.'
      }
    ],
    solvedExamples: [
      {
        problem: 'A 1.5m tall boy looks at the top of a 30m chimney. The angle of elevation increases from 30° to 60° as he walks towards it. Find the distance walked.',
        boardYear: 'NCERT Exemplar / CBSE 2022',
        solution: 'Height of chimney above boy’s eye level: h = 30 - 1.5 = 28.5 m.\nIn ΔABC (angle 60°): tan 60° = 28.5 / x  =>  √3 = 28.5 / x  =>  x = 28.5 / √3 = 9.5√3 m.\nIn ΔABD (angle 30°): tan 30° = 28.5 / (x + d)  =>  1/√3 = 28.5 / (x + d)  =>  x + d = 28.5√3 m.\n\nDistance walked (d):\nd = 28.5√3 - 9.5√3 = 19√3 m ≈ 19 × 1.732 = 32.91 m.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Forgetting to subtract observer’s height from total tower height.',
        correction: 'If observer height is given (e.g. 1.5m), eye level is 1.5m above ground. Triangle height = Total Height - 1.5.'
      }
    ]
  },

  10: {
    id: 10,
    title: 'Circles',
    badge: 'Tangents • 6 Marks',
    readTime: '11 min read',
    summary: 'Tangents to a circle, radius-tangent perpendicularity theorem, tangents from an external point theorem, and cyclic quadrilaterals circumscribing circles.',
    formulas: [
      {
        name: 'Radius-Tangent Perpendicularity',
        formula: 'Radius ⊥ Tangent at the point of contact (OP ⊥ AB)',
        explanation: 'A tangent to a circle is perpendicular to the radius through the point of contact.',
        tip: 'Whenever a tangent is given, immediately mark a 90° angle with the radius.'
      },
      {
        name: 'Tangents from External Point',
        formula: 'PA = PB (Lengths of tangents from external point P are equal)',
        explanation: 'The two tangents also subtend equal angles at the center (∠POA = ∠POB) and are equally inclined to the line joining point to center (∠APO = ∠BPO).',
        tip: 'OAPB is always a cyclic quadrilateral with ∠AOB + ∠APB = 180°.'
      }
    ],
    theorems: [
      {
        title: 'Theorem 10.2: Tangents from External Point Proof',
        statement: 'The lengths of tangents drawn from an external point to a circle are equal.',
        proofOrMethod: 'Given: Circle with center O, external point P, tangents PA and PB.\nTo Prove: PA = PB.\nConstruction: Join OA, OB, and OP.\n\nProof:\nIn right ΔOAP and right ΔOBP:\n1. ∠OAP = ∠OBP = 90° (Radius ⊥ Tangent)\n2. OP = OP (Common Hypotenuse)\n3. OA = OB (Radii of the same circle)\n\nBy RHS Congruence Criterion: ΔOAP ≅ ΔOBP.\nTherefore, PA = PB (by CPCT). (Hence Proved)',
        examImportance: 'Essential 3-mark board exam theorem.'
      }
    ],
    solvedExamples: [
      {
        problem: 'Prove that the angle between the two tangents drawn from an external point to a circle is supplementary to the angle subtended by the line-segment joining the points of contact at the center.',
        boardYear: 'CBSE 2023',
        solution: 'Let tangents be PA and PB touching at A and B.\nOA ⊥ PA  =>  ∠OAP = 90°.\nOB ⊥ PB  =>  ∠OBP = 90°.\n\nIn quadrilateral OAPB:\nSum of all four interior angles = 360°.\n∠APB + ∠AOB + ∠OAP + ∠OBP = 360°\n∠APB + ∠AOB + 90° + 90° = 360°\n∠APB + ∠AOB + 180° = 360°\n∠APB + ∠AOB = 180°.\n\nHence, the angles are supplementary.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Assuming tangents can be drawn from inside the circle.',
        correction: 'From an inside point: 0 tangents. From point on circle: 1 tangent. From outside point: exactly 2 tangents.'
      }
    ]
  },

  11: {
    id: 11,
    title: 'Areas Related to Circles',
    badge: 'Mensuration • 4 Marks',
    readTime: '10 min read',
    summary: 'Sector area, segment area, length of an arc, combination of plane figures (shaded regions, clock hands, car wipers).',
    formulas: [
      {
        name: 'Length of Arc and Area of Sector',
        formula: '• Arc Length (l) = (θ / 360°) × 2πr\n• Area of Sector = (θ / 360°) × πr² = (1/2) × l × r',
        explanation: 'θ is the central angle in degrees, r is radius of the circle.',
        tip: 'In a clock: minute hand sweeps 360° in 60 min (6°/min); hour hand sweeps 360° in 12 hours (0.5°/min).'
      },
      {
        name: 'Area of Segment of a Circle',
        formula: 'Area of Minor Segment = Area of Sector - Area of ΔOAB\n= (θ / 360°) × πr² - (1/2)r² sin θ',
        explanation: 'Major Segment Area = Total Area of Circle - Minor Segment Area.',
        tip: 'For θ = 60°: Area of Δ = (√3/4)r². For θ = 90°: Area of Δ = (1/2)r².'
      }
    ],
    theorems: [
      {
        title: 'Formula for Area of Triangle in a Sector',
        statement: 'Area of ΔOAB with central angle θ and radius r is (1/2)r² sin θ.',
        proofOrMethod: 'Draw altitude from A to OB. Altitude = r sin θ. Base = r. Area = (1/2) × Base × Height = (1/2)r² sin θ.',
        examImportance: 'Saves 5 minutes in segment calculations.'
      }
    ],
    solvedExamples: [
      {
        problem: 'Find the area of the minor segment of a circle of radius 14 cm, when the angle of the corresponding sector is 60°. (Use π = 22/7, √3 = 1.73)',
        boardYear: 'NCERT / CBSE 2022',
        solution: 'r = 14 cm, θ = 60°.\nArea of sector = (60/360) × (22/7) × 14 × 14 = (1/6) × 22 × 2 × 14 = 308 / 3 ≈ 102.67 cm².\nSince θ = 60°, ΔOAB is an equilateral triangle.\nArea of ΔOAB = (√3 / 4) × r² = (1.73 / 4) × 196 = 1.73 × 49 = 84.77 cm².\n\nArea of segment = Area of sector - Area of triangle\n                = 102.67 - 84.77 = 17.90 cm².'
      }
    ],
    pitfalls: [
      {
        mistake: 'Confusing segment with sector.',
        correction: 'Sector is pizza slice (bounded by 2 radii and arc). Segment is bounded by a chord and arc.'
      }
    ]
  },

  12: {
    id: 12,
    title: 'Surface Areas and Volumes',
    badge: 'Mensuration • 6-7 Marks',
    readTime: '13 min read',
    summary: 'Conversion of solids, combination of 3D shapes (cone on cylinder, hemisphere on cube, hollow pipes), CSA, TSA, and volume relationships.',
    formulas: [
      {
        name: 'Master 3D Solid Formulas Matrix',
        formula: '1. Cylinder: CSA = 2πrh,  TSA = 2πr(r + h),  Vol = πr²h\n2. Cone: Slant height l = √(r² + h²),  CSA = πrl,  TSA = πr(r + l),  Vol = (1/3)πr²h\n3. Sphere: SA = 4πr²,  Vol = (4/3)πr³\n4. Hemisphere: CSA = 2πr²,  TSA = 3πr²,  Vol = (2/3)πr³\n5. Cuboid: CSA = 2h(l + b),  TSA = 2(lb + bh + hl),  Vol = l·b·h',
        explanation: 'Always keep dimensions in identical units (cm or m) before computing.',
        tip: 'When two solids are joined base-to-base, the contact area is HIDDEN and NOT included in TSA.'
      },
      {
        name: 'Conservation of Volume in Melting / Recasting',
        formula: 'Volume of original solid(s) = Volume of new solid(s)',
        explanation: 'When a metallic sphere is melted and recast into smaller cones: Volume_Sphere = N × Volume_Cone.',
        tip: 'Surface area is NOT conserved during melting; only volume is conserved.'
      }
    ],
    theorems: [
      {
        title: 'TSA of Combined Solids Rule',
        statement: 'TSA of a combination of solids = Sum of visible curved surface areas.',
        proofOrMethod: 'Example: Toy formed by a cone mounted on a hemisphere of same radius r:\nTSA of toy = CSA of cone + CSA of hemisphere = πrl + 2πr² (do NOT add circular bases).',
        examImportance: 'Crucial for 4-mark mensuration problems.'
      }
    ],
    solvedExamples: [
      {
        problem: 'A solid toy is in the form of a hemisphere surmounted by a right circular cone. Height of cone is 2 cm and diameter of base is 4 cm. Determine volume of toy.',
        boardYear: 'NCERT / CBSE 2023',
        solution: 'Radius r = 4/2 = 2 cm. Height of cone h = 2 cm.\nVolume of toy = Volume of cone + Volume of hemisphere\n              = (1/3)πr²h + (2/3)πr³\n              = (1/3)πr²[h + 2r]\n              = (1/3) × (22/7) × (2)² × [2 + 2(2)]\n              = (1/3) × (22/7) × 4 × 6\n              = (22/7) × 8 = 176 / 7 ≈ 25.14 cm³.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Adding base areas when finding TSA of combined solids.',
        correction: 'Bases glued together are internal. Only add external, exposed surface areas.'
      }
    ]
  },

  13: {
    id: 13,
    title: 'Statistics',
    badge: 'Scoring • 7 Marks',
    readTime: '13 min read',
    summary: 'Mean (Direct, Assumed Mean methods), Mode of grouped data, Median of grouped data, and the empirical formula.',
    formulas: [
      {
        name: 'Mean (x̄) of Grouped Data',
        formula: '• Direct Method: x̄ = (∑fᵢxᵢ) / (∑fᵢ)\n• Assumed Mean Method: x̄ = a + (∑fᵢdᵢ) / (∑fᵢ)   [where dᵢ = xᵢ - a]',
        explanation: 'xᵢ is class mark = (Lower limit + Upper limit) / 2.',
        tip: 'Assumed mean method drastically simplifies calculation when numbers are large.'
      },
      {
        name: 'Mode of Grouped Data',
        formula: 'Mode = l + [ (f₁ - f₀) / (2f₁ - f₀ - f₂) ] × h',
        explanation: 'l = lower limit of modal class (class with highest frequency f₁),\nf₀ = frequency of preceding class, f₂ = frequency of succeeding class, h = class width.',
        tip: 'Check: Modal value MUST lie inside the modal class interval.'
      },
      {
        name: 'Median of Grouped Data',
        formula: 'Median = l + [ (N/2 - cf) / f ] × h',
        explanation: 'N = ∑fᵢ. Median class is the class where cumulative frequency exceeds N/2.\nl = lower limit of median class, cf = cumulative frequency of PRECEDING class, f = frequency of median class.',
        tip: 'cf MUST be taken from the class PRIOR to the median class.'
      },
      {
        name: 'Empirical Relationship',
        formula: '3 × Median = Mode + 2 × Mean',
        explanation: 'Enables quick computation of third central tendency if any two are given.',
        tip: 'Mnemonic: 3M = M + 2M (Alphabetical order of words: 3 Median = Mode + 2 Mean).'
      }
    ],
    theorems: [
      {
        title: 'Step-by-Step Median Algorithm',
        statement: 'How to calculate median without calculation error:',
        proofOrMethod: '1. Add a cumulative frequency (cf) column.\n2. Calculate total frequency N = ∑fᵢ and find N/2.\n3. Locate median class: first class where cf ≥ N/2.\n4. Read l, f, h, and read cf from class immediately above.\n5. Substitute into median formula.',
        examImportance: 'Guaranteed 4-mark or 5-mark question in Section D.'
      }
    ],
    solvedExamples: [
      {
        problem: 'If the median of a distribution is 28.5 and mean is 28, find the mode using the empirical relationship.',
        boardYear: 'CBSE 2021',
        solution: 'Using 3 Median = Mode + 2 Mean:\nMode = 3 Median - 2 Mean\n     = 3(28.5) - 2(28)\n     = 85.5 - 56 = 29.5.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Taking cf from the median class itself rather than preceding class.',
        correction: 'cf in formula is ALWAYS cumulative frequency of the class PRECEDING the median class.'
      }
    ]
  },

  14: {
    id: 14,
    title: 'Probability',
    badge: 'Scoring • 4-5 Marks',
    readTime: '10 min read',
    summary: 'Theoretical probability P(E) = n(E)/n(S), elementary events, complementary events P(E) + P(not E) = 1, playing cards, and dice sample spaces.',
    formulas: [
      {
        name: 'Classical Definition of Probability',
        formula: 'P(E) = (Number of outcomes favorable to E) / (Total number of possible outcomes in S)',
        explanation: 'Assumes all elementary outcomes are equally likely.',
        tip: '0 ≤ P(E) ≤ 1. Probability can never be negative or greater than 1.'
      },
      {
        name: 'Complementary Events',
        formula: 'P(E) + P(Ē) = 1   =>   P(not E) = 1 - P(E)',
        explanation: 'Very useful for "at least one" questions: P(at least one) = 1 - P(none).',
        tip: 'Sum of probabilities of all elementary events of an experiment is 1.'
      },
      {
        name: 'Standard Deck of 52 Playing Cards',
        formula: '• 52 Cards = 26 Red (13 Hearts ♥, 13 Diamonds ♦) + 26 Black (13 Spades ♠, 13 Clubs ♣)\n• 12 Face Cards = 4 Kings + 4 Queens + 4 Jacks\n• 4 Aces (Aces are NOT face cards)',
        explanation: 'Face cards are only King, Queen, and Jack.',
        tip: 'P(Face Card) = 12/52 = 3/13. P(Red Face Card) = 6/52 = 3/26.'
      },
      {
        name: 'Pair of Dice Sample Space',
        formula: 'Total outcomes = 6² = 36.\nOutcomes with sum = 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) [6 outcomes, P = 6/36 = 1/6].\nOutcomes with doublets: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6) [6 outcomes, P = 6/36 = 1/6].',
        explanation: 'Construct the 6×6 grid if unsure of counts.',
        tip: 'Maximum sum is 12 (6,6); minimum sum is 2 (1,1).'
      }
    ],
    theorems: [
      {
        title: 'Types of Events',
        statement: 'Sure Event vs Impossible Event',
        proofOrMethod: '• Impossible Event: Event that cannot occur. P(Impossible) = 0.\n• Sure / Certain Event: Event that is bound to occur. P(Sure) = 1.',
        examImportance: 'Common in Section A MCQs.'
      }
    ],
    solvedExamples: [
      {
        problem: 'One card is drawn from a well-shuffled deck of 52 cards. Find probability of getting: (i) a king of red color, (ii) a face card, (iii) the jack of hearts.',
        boardYear: 'NCERT / CBSE 2023',
        solution: 'Total possible outcomes n(S) = 52.\n(i) King of red color: 2 (King of Hearts, King of Diamonds)\n    P(Red King) = 2/52 = 1/26.\n\n(ii) Face card: 12 (4 Kings, 4 Queens, 4 Jacks)\n    P(Face Card) = 12/52 = 3/13.\n\n(iii) Jack of hearts: exactly 1 card\n    P(Jack of Hearts) = 1/52.'
      }
    ],
    pitfalls: [
      {
        mistake: 'Counting Ace as a face card.',
        correction: 'An Ace is a number card (A), NOT a face card. There are only 12 face cards (K, Q, J).'
      }
    ]
  }
};
